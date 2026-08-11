import { describe, expect, it } from "vitest";

import { mergeContentProgress } from "./content-progress";

describe("mergeContentProgress", () => {
  it("salva avanço sem regredir entre dispositivos", () => {
    expect(
      mergeContentProgress(
        { percent: 70, positionSeconds: 420, status: "in_progress" },
        { percent: 30, positionSeconds: 120 },
      ),
    ).toEqual({ percent: 70, positionSeconds: 420, status: "in_progress" });
  });

  it("limita percentuais e consolida conclusão", () => {
    expect(mergeContentProgress(null, { percent: 150 })).toEqual({
      percent: 100,
      positionSeconds: 0,
      status: "completed",
    });
  });

  it("permite concluir explicitamente", () => {
    expect(
      mergeContentProgress(null, { percent: 12, complete: true }).status,
    ).toBe("completed");
  });
});
