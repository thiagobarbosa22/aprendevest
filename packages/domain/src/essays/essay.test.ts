import { describe, expect, it } from "vitest";
import { essayWordCount, totalRubricScore, validateEssayDraft } from "./essay";

describe("redação", () => {
  it("conta palavras e protege limites de envio", () => {
    expect(essayWordCount("um  texto\ncurto")).toBe(3);
    expect(validateEssayDraft("muito curto").valid).toBe(false);
    expect(
      validateEssayDraft(Array.from({ length: 30 }, () => "palavra").join(" "))
        .valid,
    ).toBe(true);
  });
  it("limita pontuação ao máximo da rubrica", () => {
    expect(
      totalRubricScore([
        { criterion: "C1", score: 250, maxScore: 200, comment: "" },
      ]),
    ).toBe(200);
  });
});
