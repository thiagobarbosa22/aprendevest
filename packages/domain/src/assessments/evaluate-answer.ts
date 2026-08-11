export function evaluateObjectiveAnswer(input: {
  answer: string;
  correctAnswer: string;
  durationSeconds: number;
}) {
  const normalized = input.answer.trim().toLowerCase();
  const correct = normalized === input.correctAnswer.trim().toLowerCase();
  return {
    correct,
    valid: normalized.length > 0,
    durationSeconds: Math.max(
      0,
      Math.min(14_400, Math.round(input.durationSeconds)),
    ),
    shouldReview: !correct,
  };
}
