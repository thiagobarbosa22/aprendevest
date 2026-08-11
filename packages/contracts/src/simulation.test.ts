import { describe, expect, it } from "vitest";
import { simulationStartSchema, simulationUpdateSchema } from "./simulation";

describe("contratos de simulado", () => {
  it("limita duração e quantidade", () => {
    expect(
      simulationStartSchema.safeParse({
        questionCount: 91,
        durationMinutes: 30,
      }).success,
    ).toBe(false);
  });
  it("exige id opaco e tempo válido no autosave", () => {
    expect(
      simulationUpdateSchema.safeParse({ runId: "x", elapsedSeconds: -1 })
        .success,
    ).toBe(false);
  });
});
