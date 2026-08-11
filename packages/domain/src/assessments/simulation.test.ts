import { describe, expect, it } from "vitest";
import { analyzeSimulation } from "./simulation";

describe("analyzeSimulation", () => {
  it("calcula precisão e recorte por tópico", () => {
    const result = analyzeSimulation([
      { questionId: "1", topicId: "math", answer: "a", correctAnswer: "a" },
      { questionId: "2", topicId: "math", answer: "b", correctAnswer: "c" },
      {
        questionId: "3",
        topicId: "lang",
        answer: undefined,
        correctAnswer: "a",
      },
    ]);
    expect(result).toMatchObject({
      total: 3,
      answered: 2,
      correct: 1,
      accuracyPercent: 33,
    });
    expect(result.byTopic.math).toEqual({ total: 2, correct: 1 });
  });
});
