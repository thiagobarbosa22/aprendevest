export function mergeExamRun<T extends Record<string, string>>(
  previous: {
    answers: T;
    elapsedSeconds: number;
    status: "in_progress" | "submitted";
  },
  update: { answers?: Partial<T>; elapsedSeconds: number; submit?: boolean },
) {
  if (previous.status === "submitted") throw new Error("Prova já finalizada.");
  return {
    answers: { ...previous.answers, ...update.answers },
    elapsedSeconds: Math.max(
      previous.elapsedSeconds,
      Math.min(28_800, Math.round(update.elapsedSeconds)),
    ),
    status: update.submit ? ("submitted" as const) : ("in_progress" as const),
  };
}
