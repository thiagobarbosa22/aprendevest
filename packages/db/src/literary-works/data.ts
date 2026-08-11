export type LiteraryWork = {
  title: string;
  author: string;
  sourceUrl: string;
  notes?: string;
};

export type ExamSlugWithReadingList =
  "fuvest" | "unicamp" | "uerj" | "ufpr" | "ufrgs";

/**
 * Required-reading lists per vestibular/edition — changes every cycle, kept
 * separate from the general subject/lesson content on purpose. Verified via
 * web research against each institution's own announcement (Aug 2026);
 * re-check before each new edition. UNESP intentionally has no entry: VUNESP
 * does not require a reading list for its exam.
 */
export const literaryWorksByExam: Record<
  ExamSlugWithReadingList,
  { editionYear: number; editionLabel: string; works: LiteraryWork[] }
> = {
  fuvest: {
    editionYear: 2027,
    editionLabel: "Vestibular 2026–2029 (lista renovada)",
    works: [
      {
        title: "Opúsculo Humanitário",
        author: "Nísia Floresta",
        sourceUrl:
          "https://www.fuvest.br/fuvest-renova-sua-lista-de-leituras-obrigatorias-para-o-vestibular-2026-2029/",
      },
      {
        title: "Nebulosas",
        author: "Narcisa Amália",
        sourceUrl:
          "https://www.fuvest.br/fuvest-renova-sua-lista-de-leituras-obrigatorias-para-o-vestibular-2026-2029/",
      },
      {
        title: "Memórias de Martha",
        author: "Julia Lopes de Almeida",
        sourceUrl:
          "https://www.fuvest.br/fuvest-renova-sua-lista-de-leituras-obrigatorias-para-o-vestibular-2026-2029/",
      },
      {
        title: "Caminho de pedras",
        author: "Rachel de Queiroz",
        sourceUrl:
          "https://www.fuvest.br/fuvest-renova-sua-lista-de-leituras-obrigatorias-para-o-vestibular-2026-2029/",
      },
      {
        title: "A paixão segundo G. H.",
        author: "Clarice Lispector",
        sourceUrl:
          "https://www.fuvest.br/fuvest-renova-sua-lista-de-leituras-obrigatorias-para-o-vestibular-2026-2029/",
      },
      {
        title: "Geografia",
        author: "Sophia de Mello Breyner Andresen",
        sourceUrl:
          "https://www.fuvest.br/fuvest-renova-sua-lista-de-leituras-obrigatorias-para-o-vestibular-2026-2029/",
      },
      {
        title: "Balada de amor ao vento",
        author: "Paulina Chiziane",
        sourceUrl:
          "https://www.fuvest.br/fuvest-renova-sua-lista-de-leituras-obrigatorias-para-o-vestibular-2026-2029/",
      },
      {
        title: "Canção para ninar menino grande",
        author: "Conceição Evaristo",
        sourceUrl:
          "https://www.fuvest.br/fuvest-renova-sua-lista-de-leituras-obrigatorias-para-o-vestibular-2026-2029/",
      },
      {
        title: "A visão das plantas",
        author: "Djaimilia Pereira de Almeida",
        sourceUrl:
          "https://www.fuvest.br/fuvest-renova-sua-lista-de-leituras-obrigatorias-para-o-vestibular-2026-2029/",
      },
    ],
  },
  unicamp: {
    editionYear: 2027,
    editionLabel: "Vestibular 2027",
    works: [
      {
        title: "Prosas seguidas de odes mínimas",
        author: "José Paulo Paes",
        sourceUrl: "https://www.comvest.unicamp.br/lista-de-obras/",
      },
      {
        title: "Canções escolhidas",
        author: "Paulo César Pinheiro",
        sourceUrl: "https://www.comvest.unicamp.br/lista-de-obras/",
      },
      {
        title: "Os funerais da Mamãe Grande",
        author: "Gabriel García Márquez",
        sourceUrl: "https://www.comvest.unicamp.br/lista-de-obras/",
      },
      {
        title: "Morangos mofados",
        author: "Caio Fernando Abreu",
        sourceUrl: "https://www.comvest.unicamp.br/lista-de-obras/",
        notes: "Contos selecionados",
      },
      {
        title: "Olhos d'água",
        author: "Conceição Evaristo",
        sourceUrl: "https://www.comvest.unicamp.br/lista-de-obras/",
      },
      {
        title: "No seu pescoço",
        author: "Chimamanda Ngozi Adichie",
        sourceUrl: "https://www.comvest.unicamp.br/lista-de-obras/",
      },
      {
        title: "Vida e morte de M.J. Gonzaga de Sá",
        author: "Lima Barreto",
        sourceUrl: "https://www.comvest.unicamp.br/lista-de-obras/",
      },
      {
        title: "Memórias Póstumas de Brás Cubas",
        author: "Machado de Assis",
        sourceUrl: "https://www.comvest.unicamp.br/lista-de-obras/",
      },
      {
        title: "A vida não é útil",
        author: "Ailton Krenak",
        sourceUrl: "https://www.comvest.unicamp.br/lista-de-obras/",
      },
    ],
  },
  uerj: {
    editionYear: 2027,
    editionLabel: "Vestibular Estadual 2027",
    works: [
      {
        title: "Ainda estou aqui",
        author: "Marcelo Rubens Paiva",
        sourceUrl: "https://www.vestibular.uerj.br/?p=16453",
        notes: "1º Exame de Qualificação",
      },
      {
        title: "O Cortiço",
        author: "Aluísio Azevedo",
        sourceUrl: "https://www.vestibular.uerj.br/?p=16453",
        notes: "2º Exame de Qualificação",
      },
      {
        title: "Luanda, Lisboa, Paraíso",
        author: "Djaimilia Pereira de Almeida",
        sourceUrl: "https://www.vestibular.uerj.br/?p=16453",
        notes: "Exame Discursivo — Língua Portuguesa e Literaturas",
      },
      {
        title: "O bem-amado",
        author: "Dias Gomes",
        sourceUrl: "https://www.vestibular.uerj.br/?p=16453",
        notes: "Exame Discursivo — Redação",
      },
    ],
  },
  ufpr: {
    editionYear: 2027,
    editionLabel: "Vestibular 2027",
    works: [
      {
        title: "A falência",
        author: "Julia Lopes de Almeida",
        sourceUrl:
          "https://ufpr.br/divulgada-a-lista-de-obras-para-o-vestibular-2027-da-ufpr/",
      },
      {
        title: "Eu",
        author: "Augusto dos Anjos",
        sourceUrl:
          "https://ufpr.br/divulgada-a-lista-de-obras-para-o-vestibular-2027-da-ufpr/",
      },
      {
        title: "Noite na taverna",
        author: "Álvares de Azevedo",
        sourceUrl:
          "https://ufpr.br/divulgada-a-lista-de-obras-para-o-vestibular-2027-da-ufpr/",
      },
      {
        title: "O demônio familiar",
        author: "José de Alencar",
        sourceUrl:
          "https://ufpr.br/divulgada-a-lista-de-obras-para-o-vestibular-2027-da-ufpr/",
      },
      {
        title: "O drible",
        author: "Sérgio Rodrigues",
        sourceUrl:
          "https://ufpr.br/divulgada-a-lista-de-obras-para-o-vestibular-2027-da-ufpr/",
      },
      {
        title: "O Quinze",
        author: "Rachel de Queiroz",
        sourceUrl:
          "https://ufpr.br/divulgada-a-lista-de-obras-para-o-vestibular-2027-da-ufpr/",
      },
      {
        title: "O sol na cabeça",
        author: "Geovani Martins",
        sourceUrl:
          "https://ufpr.br/divulgada-a-lista-de-obras-para-o-vestibular-2027-da-ufpr/",
      },
      {
        title: "Poema sujo",
        author: "Ferreira Gullar",
        sourceUrl:
          "https://ufpr.br/divulgada-a-lista-de-obras-para-o-vestibular-2027-da-ufpr/",
      },
    ],
  },
  ufrgs: {
    editionYear: 2027,
    editionLabel: "Vestibular 2027",
    works: [
      {
        title: "Quincas Borba",
        author: "Machado de Assis",
        sourceUrl:
          "https://www.ufrgs.br/site/noticias/ufrgs-divulga-lista-de-leituras-obrigatorias-para-o-vestibular-2027/",
      },
      {
        title: "O Demônio Familiar",
        author: "José de Alencar",
        sourceUrl:
          "https://www.ufrgs.br/site/noticias/ufrgs-divulga-lista-de-leituras-obrigatorias-para-o-vestibular-2027/",
      },
      {
        title: "Mrs. Dalloway",
        author: "Virginia Woolf",
        sourceUrl:
          "https://www.ufrgs.br/site/noticias/ufrgs-divulga-lista-de-leituras-obrigatorias-para-o-vestibular-2027/",
      },
      {
        title: "A Visão das Plantas",
        author: "Djaimilia Pereira de Almeida",
        sourceUrl:
          "https://www.ufrgs.br/site/noticias/ufrgs-divulga-lista-de-leituras-obrigatorias-para-o-vestibular-2027/",
      },
      {
        title: "Niketche: uma história de poligamia",
        author: "Paulina Chiziane",
        sourceUrl:
          "https://www.ufrgs.br/site/noticias/ufrgs-divulga-lista-de-leituras-obrigatorias-para-o-vestibular-2027/",
      },
      {
        title: "O avesso da pele",
        author: "Jeferson Tenório",
        sourceUrl:
          "https://www.ufrgs.br/site/noticias/ufrgs-divulga-lista-de-leituras-obrigatorias-para-o-vestibular-2027/",
      },
      {
        title: "Mas em que mundo tu vive",
        author: "José Falero",
        sourceUrl:
          "https://www.ufrgs.br/site/noticias/ufrgs-divulga-lista-de-leituras-obrigatorias-para-o-vestibular-2027/",
      },
      {
        title: "Seleta de Canções",
        author: "Lupicínio Rodrigues",
        sourceUrl:
          "https://www.ufrgs.br/site/noticias/ufrgs-divulga-lista-de-leituras-obrigatorias-para-o-vestibular-2027/",
      },
      {
        title: "Ideias para adiar o fim do mundo",
        author: "Ailton Krenak",
        sourceUrl:
          "https://www.ufrgs.br/site/noticias/ufrgs-divulga-lista-de-leituras-obrigatorias-para-o-vestibular-2027/",
      },
      {
        title: "Macunaíma",
        author: "Mário de Andrade",
        sourceUrl:
          "https://www.ufrgs.br/site/noticias/ufrgs-divulga-lista-de-leituras-obrigatorias-para-o-vestibular-2027/",
      },
      {
        title: "A fúria",
        author: "Silvina Ocampo",
        sourceUrl:
          "https://www.ufrgs.br/site/noticias/ufrgs-divulga-lista-de-leituras-obrigatorias-para-o-vestibular-2027/",
      },
      {
        title: "A teus pés",
        author: "Ana Cristina César",
        sourceUrl:
          "https://www.ufrgs.br/site/noticias/ufrgs-divulga-lista-de-leituras-obrigatorias-para-o-vestibular-2027/",
      },
    ],
  },
};
