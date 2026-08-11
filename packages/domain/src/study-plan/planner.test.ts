import { describe, expect, it } from "vitest";
import { buildWeeklyPlan, estimateMastery, nextReviewDate } from "./planner";

describe("planejador", () => {
  it("prioriza lacunas e explica a recomendação", () => {
    const tasks = buildWeeklyPlan(
      [
        {
          topicId: "forte",
          title: "Forte",
          priority: 1,
          mastery: 0.9,
          estimatedMinutes: 30,
        },
        {
          topicId: "lacuna",
          title: "Lacuna",
          priority: 2,
          mastery: 0.2,
          estimatedMinutes: 30,
        },
      ],
      60,
      new Date("2026-08-10T00:00:00Z"),
    );
    expect(tasks[0]).toMatchObject({ topicId: "lacuna", kind: "theory" });
    expect(tasks[0]?.reason).toBeTruthy();
  });
  it("pondera confiança do diagnóstico", () => {
    expect(
      estimateMastery([
        { topicId: "t", score: 1, confidence: 1 },
        { topicId: "t", score: 0, confidence: 0.25 },
      ]).get("t"),
    ).toBe(0.8);
  });
  it("reinicia revisão após dificuldade", () => {
    expect(nextReviewDate(10, 2).intervalDays).toBe(1);
  });
});
