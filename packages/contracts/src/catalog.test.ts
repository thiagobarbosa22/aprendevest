import { describe, expect, it } from "vitest";

import { examDraftSchema } from "./catalog";

const validExam = {
  name: "Exame Nacional do Ensino Médio",
  acronym: "ENEM",
  slug: "enem",
  institution: "INEP",
  board: "INEP",
  region: "Brasil",
  officialUrl: "https://www.gov.br/inep/",
  sourceUrl: "https://www.gov.br/inep/",
  rightsStatus: "official_link",
  summary:
    "Metadados demonstrativos baseados exclusivamente na página oficial do exame.",
};

describe("examDraftSchema", () => {
  it("aceita catálogo com procedência explícita", () => {
    expect(examDraftSchema.parse(validExam)).toMatchObject({ slug: "enem" });
  });

  it("rejeita slug e fonte inválidos", () => {
    expect(() =>
      examDraftSchema.parse({
        ...validExam,
        slug: "ENEM 2026",
        sourceUrl: "fonte",
      }),
    ).toThrow();
  });
});
