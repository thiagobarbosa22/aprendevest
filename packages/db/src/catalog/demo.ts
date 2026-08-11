export const demoExams = [
  {
    id: "demo-enem",
    slug: "enem",
    name: "Exame Nacional do Ensino Médio",
    acronym: "ENEM",
    institution:
      "Instituto Nacional de Estudos e Pesquisas Educacionais Anísio Teixeira",
    board: "INEP",
    region: "Brasil",
    officialUrl:
      "https://www.gov.br/inep/pt-br/areas-de-atuacao/avaliacao-e-exames-educacionais/enem",
    sourceUrl:
      "https://www.gov.br/inep/pt-br/areas-de-atuacao/avaliacao-e-exames-educacionais/enem",
    summary:
      "Avaliação nacional usada no acesso ao ensino superior, organizada em quatro áreas e redação.",
    rightsStatus: "official_link" as const,
    version: 1,
    verifiedAt: new Date("2026-08-01T00:00:00.000Z"),
  },
  {
    id: "demo-fuvest",
    slug: "fuvest",
    name: "Vestibular da Universidade de São Paulo",
    acronym: "FUVEST",
    institution: "Universidade de São Paulo",
    board: "FUVEST",
    region: "São Paulo",
    officialUrl: "https://www.fuvest.br/",
    sourceUrl: "https://www.fuvest.br/",
    summary:
      "Processo seletivo da USP com etapas e regras versionadas por edição.",
    rightsStatus: "official_link" as const,
    version: 1,
    verifiedAt: new Date("2026-08-01T00:00:00.000Z"),
  },
];

export const demoSubjects = [
  {
    id: "demo-matematica",
    slug: "matematica",
    name: "Matemática",
    area: "mathematics" as const,
    summary:
      "Aritmética, álgebra, funções, geometria, estatística e probabilidade.",
  },
  {
    id: "demo-portugues",
    slug: "lingua-portuguesa",
    name: "Língua Portuguesa",
    area: "languages" as const,
    summary: "Interpretação, gramática, literatura e produção de texto.",
  },
  {
    id: "demo-biologia",
    slug: "biologia",
    name: "Biologia",
    area: "natural_sciences" as const,
    summary: "Citologia, genética, evolução, ecologia e fisiologia.",
  },
  {
    id: "demo-historia",
    slug: "historia",
    name: "História",
    area: "human_sciences" as const,
    summary:
      "Processos históricos do Brasil e do mundo em perspectiva crítica.",
  },
  {
    id: "demo-quimica",
    slug: "quimica",
    name: "Química",
    area: "natural_sciences" as const,
    summary:
      "Química orgânica, inorgânica, estequiometria, termoquímica e eletroquímica.",
  },
  {
    id: "demo-fisica",
    slug: "fisica",
    name: "Física",
    area: "natural_sciences" as const,
    summary: "Mecânica, termologia, eletricidade, óptica e ondulatória.",
  },
];
