import type { ContentBlock } from "@aprendevest/contracts";

export const demoLessons = [
  {
    id: "c69e0764-0cbe-4be3-a81d-a4d81879d061",
    slug: "funcoes-primeiros-passos",
    title: "Funções: primeiros passos",
    summary:
      "Entenda relação, domínio, imagem e como reconhecer uma função em tabelas e gráficos.",
    subjectSlug: "matematica",
    subjectName: "Matemática",
    topicName: "Funções",
    estimatedMinutes: 25,
    objectives: [
      "Reconhecer uma função",
      "Identificar domínio e imagem",
      "Interpretar representações simples",
    ],
    body: [
      { type: "heading", text: "O que é uma função?" },
      {
        type: "paragraph",
        text: "Uma função associa cada elemento do domínio a exatamente um elemento do contradomínio. A regra pode aparecer como fórmula, tabela, diagrama ou gráfico.",
      },
      {
        type: "example",
        title: "Temperatura ao longo do dia",
        text: "Se cada horário possui uma única temperatura medida, a tabela horário → temperatura representa uma função.",
      },
      {
        type: "formula",
        expression: "f(x) = 2x + 1",
        description: "Para cada valor de x, a regra produz um único resultado.",
      },
      {
        type: "check",
        question: "Uma entrada pode ter duas saídas diferentes em uma função?",
        answer:
          "Não. Cada elemento do domínio deve estar associado a uma única saída.",
      },
    ] satisfies ContentBlock[],
    accessibleText:
      "Funções associam cada entrada a uma única saída. Domínio é o conjunto de entradas; imagem reúne as saídas obtidas.",
    sourceUrl:
      "https://curriculo.sedu.es.gov.br/curriculo/wp-content/uploads/2020/02/BNCC_EnsinoMedio_embaixa_site_110518.pdf",
    rightsStatus: "platform_authored" as const,
    version: 1,
  },
];
