import { describe, expect, it } from "vitest";

import { contentBlockSchema, contentProgressSchema } from "./content";

describe("contratos de conteúdo", () => {
  it("aceita bloco textual estruturado", () => {
    expect(
      contentBlockSchema.parse({
        type: "paragraph",
        text: "Uma explicação revisada.",
      }),
    ).toEqual({
      type: "paragraph",
      text: "Uma explicação revisada.",
    });
  });

  it("rejeita progresso fora do intervalo", () => {
    expect(() =>
      contentProgressSchema.parse({
        contentId: "c69e0764-0cbe-4be3-a81d-a4d81879d061",
        percent: 101,
      }),
    ).toThrow();
  });
});
