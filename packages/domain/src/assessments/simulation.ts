export type SimulationAnswer = {
  questionId: string;
  topicId: string;
  answer: string | undefined;
  correctAnswer: string;
  durationSeconds?: number;
};

export type SimulationResult = {
  total: number;
  answered: number;
  correct: number;
  accuracyPercent: number;
  byTopic: Record<string, { total: number; correct: number }>;
};

export function analyzeSimulation(items: SimulationAnswer[]): SimulationResult {
  const byTopic: SimulationResult["byTopic"] = {};
  let answered = 0;
  let correct = 0;
  for (const item of items) {
    const topic = byTopic[item.topicId] ?? { total: 0, correct: 0 };
    topic.total += 1;
    if (item.answer) answered += 1;
    if (item.answer === item.correctAnswer) {
      correct += 1;
      topic.correct += 1;
    }
    byTopic[item.topicId] = topic;
  }
  return {
    total: items.length,
    answered,
    correct,
    accuracyPercent: items.length
      ? Math.round((correct / items.length) * 100)
      : 0,
    byTopic,
  };
}
