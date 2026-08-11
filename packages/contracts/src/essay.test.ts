import { describe, expect, it } from "vitest";
import { essayDraftSchema } from "./essay";

describe("essayDraftSchema", () => {
  it("rejeita tema sem id e texto vazio", () => {
    expect(
      essayDraftSchema.safeParse({ themeId: "x", title: "T", text: "" })
        .success,
    ).toBe(false);
  });
});
