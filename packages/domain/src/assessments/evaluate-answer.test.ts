import { describe, expect, it } from "vitest";
import { evaluateObjectiveAnswer } from "./evaluate-answer";

describe("evaluateObjectiveAnswer", () => {
  it("normaliza resposta e agenda erro", () => {
    expect(
      evaluateObjectiveAnswer({
        answer: " B ",
        correctAnswer: "b",
        durationSeconds: 32,
      }),
    ).toMatchObject({ correct: true, shouldReview: false });
    expect(
      evaluateObjectiveAnswer({
        answer: "a",
        correctAnswer: "b",
        durationSeconds: 32,
      }).shouldReview,
    ).toBe(true);
  });
});
