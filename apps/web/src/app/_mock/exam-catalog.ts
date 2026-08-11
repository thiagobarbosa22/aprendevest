/**
 * DADOS DE EXEMPLO — sem contrato de catálogo ainda (Fase 2, ver docs/PLAN.md).
 * Substituir por dados reais assim que `GET /api/v1/exams` (ou equivalente) for documentado
 * em docs/API_CONTRACTS.md. Não usar em produção.
 */
export interface MockExamPreview {
  slug: string;
  name: string;
  institution: string;
  priority: "P0" | "P1" | "P2";
}

export const mockExamCatalog: MockExamPreview[] = [
  { slug: "enem", name: "ENEM", institution: "INEP", priority: "P0" },
  { slug: "fuvest", name: "FUVEST", institution: "USP", priority: "P0" },
  { slug: "unicamp", name: "UNICAMP", institution: "COMVEST", priority: "P0" },
  { slug: "unesp", name: "UNESP", institution: "VUNESP", priority: "P0" },
  { slug: "uerj", name: "UERJ", institution: "UERJ", priority: "P1" },
  { slug: "ita", name: "ITA", institution: "ITA", priority: "P1" },
];
