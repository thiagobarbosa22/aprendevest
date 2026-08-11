import type { ContentBlock } from "@aprendevest/contracts";

import { lessonVideosBySubject, type SubjectSlug } from "./lesson-videos";

const subjectNames: Record<SubjectSlug, string> = {
  matematica: "Matemática",
  "lingua-portuguesa": "Língua Portuguesa",
  biologia: "Biologia",
  historia: "História",
  quimica: "Química",
  fisica: "Física",
  literatura: "Literatura",
  redacao: "Redação",
  geografia: "Geografia",
  filosofia: "Filosofia",
  sociologia: "Sociologia",
  ingles: "Inglês",
  espanhol: "Espanhol",
  artes: "Artes",
  "educacao-fisica": "Educação Física",
};

const demoVideoLessons = Object.entries(lessonVideosBySubject).flatMap(
  ([subjectSlug, subtopics]) =>
    subtopics.map((subtopic) => ({
      id: `demo-${subjectSlug}-${subtopic.slug}`,
      slug: `${subjectSlug}-${subtopic.slug}`,
      title: subtopic.name,
      summary: `Videoaula "${subtopic.videoTitle}", pelo canal ${subtopic.channel}.`,
      subjectSlug,
      subjectName: subjectNames[subjectSlug as SubjectSlug],
      topicName: subtopic.name,
      frenteName: subtopic.frenteName as string | null,
      estimatedMinutes: subtopic.estimatedMinutes,
      objectives: [`Revisar os principais conceitos de ${subtopic.name}`],
      body: [
        { type: "heading", text: subtopic.name },
        {
          type: "paragraph",
          text: `Assista à videoaula acima para revisar ${subtopic.name.toLowerCase()}. Conteúdo pelo canal ${subtopic.channel}.`,
        },
      ] satisfies ContentBlock[],
      accessibleText: `Videoaula "${subtopic.videoTitle}", do canal ${subtopic.channel}, sobre ${subtopic.name}.`,
      sourceUrl: subtopic.videoUrl,
      rightsStatus: "official_link" as const,
      version: 1,
      mediaUrl: subtopic.videoUrl as string | null,
      level: "basico" as const,
      pedagogicalType: (subtopic.videoTitle.toLowerCase().includes("resumo")
        ? "revisao"
        : "teoria") as "teoria" | "revisao",
      examTags: ["ENEM"] as string[],
      prerequisiteSummary: (subtopic.prerequisiteSummary ?? null) as
        string | null,
    })),
);

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
    frenteName: "Funções" as string | null,
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
    mediaUrl: null as string | null,
    level: "basico" as const,
    pedagogicalType: "teoria" as "teoria" | "revisao",
    examTags: ["ENEM"] as string[],
    prerequisiteSummary: null as string | null,
  },
  ...demoVideoLessons,
];
