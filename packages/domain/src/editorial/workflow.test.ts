import { describe, expect, it } from "vitest";

import {
  assertPublishableMetadata,
  canTransitionEditorialStatus,
} from "./workflow";

describe("workflow editorial", () => {
  it("não permite publicar diretamente do rascunho", () => {
    expect(canTransitionEditorialStatus("draft", "published")).toBe(false);
    expect(canTransitionEditorialStatus("approved", "published")).toBe(true);
  });

  it("bloqueia publicação sem procedência e revisão", () => {
    expect(() =>
      assertPublishableMetadata({
        sourceUrl: "https://example.org/oficial",
        rightsStatus: "official_link",
        authorId: "autor",
      }),
    ).toThrow("revisão");
  });

  it("aceita metadados editoriais completos", () => {
    expect(() =>
      assertPublishableMetadata({
        sourceUrl: "https://example.org/oficial",
        rightsStatus: "official_link",
        authorId: "autor",
        reviewerId: "revisor",
      }),
    ).not.toThrow();
  });
});
