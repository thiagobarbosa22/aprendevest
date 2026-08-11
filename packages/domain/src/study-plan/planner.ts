export type DiagnosticAnswer = {
  topicId: string;
  score: number;
  confidence?: number;
};

export type PlanTopic = {
  topicId: string;
  title: string;
  priority: number;
  mastery: number;
  estimatedMinutes: number;
};

export type PlannedTask = PlanTopic & {
  kind: "theory" | "practice" | "review";
  minutes: number;
  reason: string;
  scheduledFor: Date;
};

export function estimateMastery(answers: DiagnosticAnswer[]) {
  const grouped = new Map<string, { weighted: number; weight: number }>();
  for (const answer of answers) {
    const weight = Math.max(0.25, Math.min(1, answer.confidence ?? 1));
    const current = grouped.get(answer.topicId) ?? { weighted: 0, weight: 0 };
    current.weighted += Math.max(0, Math.min(1, answer.score)) * weight;
    current.weight += weight;
    grouped.set(answer.topicId, current);
  }
  return new Map(
    [...grouped].map(([topicId, value]) => [
      topicId,
      Math.round((value.weighted / value.weight) * 100) / 100,
    ]),
  );
}

export function buildWeeklyPlan(
  topics: PlanTopic[],
  weeklyMinutes: number,
  start = new Date(),
): PlannedTask[] {
  let remaining = Math.max(30, Math.min(2_400, weeklyMinutes));
  const tasks: PlannedTask[] = [];
  const ordered = [...topics].sort(
    (a, b) => b.priority * (1 - b.mastery) - a.priority * (1 - a.mastery),
  );
  for (let index = 0; index < ordered.length && remaining >= 15; index++) {
    const topic = ordered[index]!;
    const minutes = Math.min(45, topic.estimatedMinutes, remaining);
    const kind =
      topic.mastery < 0.4
        ? "theory"
        : topic.mastery < 0.75
          ? "practice"
          : "review";
    const scheduledFor = new Date(start);
    scheduledFor.setUTCDate(start.getUTCDate() + (index % 6));
    tasks.push({
      ...topic,
      kind,
      minutes,
      scheduledFor,
      reason:
        kind === "theory"
          ? "Base prioritária com domínio ainda baixo."
          : kind === "practice"
            ? "Prática recomendada para consolidar o domínio atual."
            : "Revisão curta para preservar a retenção.",
    });
    remaining -= minutes;
  }
  return tasks;
}

export function nextReviewDate(
  previousIntervalDays: number,
  quality: 0 | 1 | 2 | 3 | 4 | 5,
  from = new Date(),
) {
  const intervalDays =
    quality < 3
      ? 1
      : Math.max(
          2,
          Math.round(
            Math.max(1, previousIntervalDays) * (1.35 + quality * 0.15),
          ),
        );
  const date = new Date(from);
  date.setUTCDate(date.getUTCDate() + intervalDays);
  return { intervalDays, date };
}
