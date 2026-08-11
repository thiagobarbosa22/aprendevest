import { describe, expect, it } from "vitest";
import { mergeExamRun } from "./exam-run";

describe("mergeExamRun", () => {
  it("mescla autosave sem regredir tempo", () =>
    expect(
      mergeExamRun<Record<string, string>>(
        { answers: { q1: "a" }, elapsedSeconds: 60, status: "in_progress" },
        { answers: { q2: "b" }, elapsedSeconds: 30 },
      ),
    ).toMatchObject({ answers: { q1: "a", q2: "b" }, elapsedSeconds: 60 }));
  it("torna finalização imutável", () =>
    expect(() =>
      mergeExamRun(
        { answers: {}, elapsedSeconds: 1, status: "submitted" },
        { elapsedSeconds: 2 },
      ),
    ).toThrow());
});
