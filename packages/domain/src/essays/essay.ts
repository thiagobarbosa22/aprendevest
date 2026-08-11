export type EssayRubricScore = {
  criterion: string;
  score: number;
  maxScore: number;
  comment: string;
};

export function essayWordCount(text: string) {
  const normalized = text.trim();
  return normalized ? normalized.split(/\s+/u).length : 0;
}

export function validateEssayDraft(text: string) {
  const words = essayWordCount(text);
  return {
    words,
    valid: words >= 30 && words <= 2_000,
    message:
      words < 30
        ? "Desenvolva o texto antes de enviar para correção."
        : words > 2_000
          ? "O texto excede o limite seguro de 2.000 palavras."
          : undefined,
  };
}

export function totalRubricScore(scores: EssayRubricScore[]) {
  return scores.reduce(
    (total, item) => total + Math.max(0, Math.min(item.score, item.maxScore)),
    0,
  );
}
