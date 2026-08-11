export type SubjectSlug =
  | "matematica"
  | "lingua-portuguesa"
  | "biologia"
  | "historia"
  | "quimica"
  | "fisica";

export type LessonVideo = {
  slug: string;
  name: string;
  videoTitle: string;
  channel: string;
  videoUrl: string;
  estimatedMinutes: number;
};

/**
 * Curated (not API-searched) YouTube videos per subject subtopic, embedded
 * directly on the lesson page. Picked from established Brazilian ENEM/
 * vestibular-prep channels; update by replacing videoUrl.
 */
export const lessonVideosBySubject: Record<SubjectSlug, LessonVideo[]> = {
  matematica: [
    {
      slug: "funcoes",
      name: "Funções",
      videoTitle: "Funções: Noções Básicas (Aula 1 de 15)",
      channel: "Professor Ferretto | ENEM e Vestibulares",
      videoUrl: "https://www.youtube.com/watch?v=SPZqQ5qn3P0",
      estimatedMinutes: 20,
    },
    {
      slug: "geometria-plana",
      name: "Geometria Plana",
      videoTitle:
        "Geometria Plana | AULA do ZERO - Matemática | Me Salva! ENEM 2021",
      channel: "Me Salva! ENEM",
      videoUrl: "https://www.youtube.com/watch?v=mxtBAXqFCcM",
      estimatedMinutes: 35,
    },
    {
      slug: "estatistica-e-probabilidade",
      name: "Estatística e Probabilidade",
      videoTitle: "Estatística e Probabilidade - Aula 01 - Aleatoriedade",
      channel: "UNIVESP",
      videoUrl: "https://www.youtube.com/watch?v=VRiFnz7Di20",
      estimatedMinutes: 15,
    },
    {
      slug: "porcentagem-e-juros",
      name: "Porcentagem e Juros",
      videoTitle: "MATEMÁTICA FINANCEIRA (ENEM) - Aula 1: Porcentagem",
      channel: "Fique Tranquilo - Matemática com prof. Bruno",
      videoUrl: "https://www.youtube.com/watch?v=JKwkR-caXSw",
      estimatedMinutes: 20,
    },
    {
      slug: "trigonometria",
      name: "Trigonometria",
      videoTitle:
        "TRIGONOMETRIA NO TRIÂNGULO RETÂNGULO (ENEM) - Aula 1: Seno, cosseno e tangente",
      channel: "Fique Tranquilo - Matemática com prof. Bruno",
      videoUrl: "https://www.youtube.com/watch?v=xkMKPDqPEjE",
      estimatedMinutes: 20,
    },
  ],
  "lingua-portuguesa": [
    {
      slug: "interpretacao-de-texto",
      name: "Interpretação de Texto",
      videoTitle: "Compreensão e Interpretação de Texto – Revisão ENEM",
      channel: "Professor Noslen",
      videoUrl: "https://www.youtube.com/watch?v=XsN0e_xPyNI",
      estimatedMinutes: 25,
    },
    {
      slug: "figuras-de-linguagem",
      name: "Figuras de Linguagem",
      videoTitle:
        "FIGURAS DE LINGUAGEM: Aula COMPLETA para Você NÃO Errar Mais!",
      channel: "Português sem Enrolação - Professora Lis",
      videoUrl: "https://www.youtube.com/watch?v=zTe7izGQ8-4",
      estimatedMinutes: 25,
    },
    {
      slug: "concordancia-verbal-e-nominal",
      name: "Concordância Verbal e Nominal",
      videoTitle: "CONCORDÂNCIA VERBAL E NOMINAL - AULA 01",
      channel: "Pablo Jamilk",
      videoUrl: "https://www.youtube.com/watch?v=RgChoEg6enk",
      estimatedMinutes: 30,
    },
    {
      slug: "modernismo-brasileiro",
      name: "Literatura: Modernismo Brasileiro",
      videoTitle:
        "Literatura - Modernismo Brasileiro - Contexto Histórico | ENEM",
      channel: "Scribs - Redação ENEM",
      videoUrl: "https://www.youtube.com/watch?v=SD9tLEUnEME",
      estimatedMinutes: 20,
    },
    {
      slug: "redacao-nota-1000",
      name: "Redação Nota 1000",
      videoTitle:
        "Como fazer sua primeira REDAÇÃO NOTA 1000 do ZERO (atualizado para 2026)",
      channel: "Profinho",
      videoUrl: "https://www.youtube.com/watch?v=Y86ZJPVhmZo",
      estimatedMinutes: 25,
    },
  ],
  biologia: [
    {
      slug: "citologia",
      name: "Citologia",
      videoTitle: "TUDO DE CITOLOGIA PARA O ENEM 2026 | DIDÁTICA MÁGICA",
      channel: "Pedro Assaad | ENEM 2026",
      videoUrl: "https://www.youtube.com/watch?v=I6XycvmojEo",
      estimatedMinutes: 30,
    },
    {
      slug: "genetica-e-hereditariedade",
      name: "Genética e Hereditariedade",
      videoTitle: "INTRODUÇÃO À GENÉTICA | Resumo de Biologia para o Enem",
      channel: "Curso Enem Gratuito",
      videoUrl: "https://www.youtube.com/watch?v=JsLH-x_tSZ0",
      estimatedMinutes: 20,
    },
    {
      slug: "ecologia",
      name: "Ecologia",
      videoTitle: "Tudo sobre ECOLOGIA para o ENEM",
      channel: "Paulo Jubilut",
      videoUrl: "https://www.youtube.com/watch?v=Rr-zQYqRCzo",
      estimatedMinutes: 30,
    },
    {
      slug: "evolucao",
      name: "Evolução",
      videoTitle: "Seleção Natural | Evolução no ENEM",
      channel: "Paulo Jubilut",
      videoUrl: "https://www.youtube.com/watch?v=Uodc0C4jFQs",
      estimatedMinutes: 20,
    },
    {
      slug: "fisiologia-humana",
      name: "Fisiologia Humana",
      videoTitle: "SISTEMAS DO CORPO HUMANO - Resumo de Fisiologia",
      channel: "Biologia com Samuel Cunha",
      videoUrl: "https://www.youtube.com/watch?v=gz9BSAnNjKE",
      estimatedMinutes: 25,
    },
  ],
  historia: [
    {
      slug: "brasil-colonia",
      name: "Brasil Colônia",
      videoTitle: "BRASIL COLÔNIA | Resumo de História do Brasil para o Enem",
      channel: "Curso Enem Gratuito",
      videoUrl: "https://www.youtube.com/watch?v=RX2eB7zf87g",
      estimatedMinutes: 20,
    },
    {
      slug: "era-vargas",
      name: "Era Vargas",
      videoTitle:
        "ERA VARGAS (1930 – 1937) | Resumo de História do Brasil para o Enem",
      channel: "Curso Enem Gratuito",
      videoUrl: "https://www.youtube.com/watch?v=pqEDSyU6tsw",
      estimatedMinutes: 20,
    },
    {
      slug: "guerra-fria",
      name: "Guerra Fria",
      videoTitle:
        "GUERRA FRIA ENTRE OS EUA E A URSS: conflitos e características | RESUMO DE HISTÓRIA ENEM",
      channel: "Curso Enem Gratuito",
      videoUrl: "https://www.youtube.com/watch?v=mjqfi1mOKLI",
      estimatedMinutes: 20,
    },
    {
      slug: "revolucao-industrial",
      name: "Revolução Industrial",
      videoTitle: "REVOLUÇÃO INDUSTRIAL | Resumo de História para o Enem",
      channel: "Curso Enem Gratuito",
      videoUrl: "https://www.youtube.com/watch?v=NFrNx3JOXSg",
      estimatedMinutes: 20,
    },
    {
      slug: "ditadura-militar",
      name: "Ditadura Militar no Brasil",
      videoTitle:
        'DITADURA MILITAR: período é retratado em "Ainda Estou Aqui" | História para o Enem',
      channel: "Curso Enem Gratuito",
      videoUrl: "https://www.youtube.com/watch?v=D4TMrqvunls",
      estimatedMinutes: 20,
    },
  ],
  quimica: [
    {
      slug: "quimica-organica",
      name: "Química Orgânica",
      videoTitle:
        "QUÍMICA ORGÂNICA: Tudo sobre Cadeias Carbônicas e Funções Orgânicas | ENEM e Vestibular",
      channel: "Toda Matéria",
      videoUrl: "https://www.youtube.com/watch?v=WQBpu-IbFKw",
      estimatedMinutes: 25,
    },
    {
      slug: "estequiometria",
      name: "Estequiometria",
      videoTitle: "ESTEQUIOMETRIA | Resumo de Química para o Enem",
      channel: "Curso Enem Gratuito",
      videoUrl: "https://www.youtube.com/watch?v=vodua1lGa68",
      estimatedMinutes: 20,
    },
    {
      slug: "quimica-inorganica-e-ligacoes",
      name: "Química Inorgânica e Ligações Químicas",
      videoTitle:
        "Ligações Químicas | AULA do ZERO - Química | Me Salva! ENEM 2021",
      channel: "Me Salva! ENEM",
      videoUrl: "https://www.youtube.com/watch?v=X5xOEgJtCHU",
      estimatedMinutes: 35,
    },
    {
      slug: "termoquimica",
      name: "Termoquímica",
      videoTitle: "Química para o ENEM - Termoquímica (variações de entalpia)",
      channel: "ProEnem - Enem 2026",
      videoUrl: "https://www.youtube.com/watch?v=2xEjPZ9p1B8",
      estimatedMinutes: 20,
    },
    {
      slug: "eletroquimica",
      name: "Eletroquímica",
      videoTitle: "AULA QUÍMICA - ELETROQUÍMICA: Pilhas",
      channel: "Stoodi",
      videoUrl: "https://www.youtube.com/watch?v=nTkxw0797eE",
      estimatedMinutes: 15,
    },
  ],
  fisica: [
    {
      slug: "mecanica",
      name: "Mecânica (Cinemática e Dinâmica)",
      videoTitle:
        "TUDO DE CINEMÁTICA PARA O ENEM!! - Física Básica Completa (MESTRES DO ENEM)",
      channel: "Umberto Mannarino - Mestres do ENEM",
      videoUrl: "https://www.youtube.com/watch?v=NCxNuTLIu9Y",
      estimatedMinutes: 30,
    },
    {
      slug: "eletricidade",
      name: "Eletricidade",
      videoTitle:
        "MEGA REVISÃO COMPLETA de FÍSICA para o ENEM | ELETRICIDADE | Aula 03",
      channel: "Professor Boaro",
      videoUrl: "https://www.youtube.com/watch?v=6yIdTlAFhZY",
      estimatedMinutes: 30,
    },
    {
      slug: "termologia",
      name: "Termologia",
      videoTitle:
        "CALORIMETRIA: aprenda os conceitos iniciais | Física para o Enem",
      channel: "Curso Enem Gratuito",
      videoUrl: "https://www.youtube.com/watch?v=E4B0RatuhI4",
      estimatedMinutes: 20,
    },
    {
      slug: "optica",
      name: "Óptica",
      videoTitle: "ÓPTICA: aprenda os conceitos iniciais | Física para o Enem",
      channel: "Curso Enem Gratuito",
      videoUrl: "https://www.youtube.com/watch?v=B4LQMZluelI",
      estimatedMinutes: 20,
    },
    {
      slug: "ondulatoria",
      name: "Ondulatória",
      videoTitle:
        "ONDULATÓRIA: principais características das ondas | RESUMO DE FÍSICA PARA O ENEM",
      channel: "Curso Enem Gratuito",
      videoUrl: "https://www.youtube.com/watch?v=Rmgqv8ETn6o",
      estimatedMinutes: 20,
    },
  ],
};
