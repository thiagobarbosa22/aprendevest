import { createHash, randomBytes, scrypt as scryptCallback } from "node:crypto";
import { config } from "dotenv";
import { and, eq, sql } from "drizzle-orm";

import { getDatabase } from "./client";
import {
  consents,
  contentItems,
  curriculumModules,
  exams,
  examEditions,
  examPaperQuestions,
  examPapers,
  essayThemes,
  featureFlags,
  literaryWorks,
  profiles,
  questions,
  subjects,
  topics,
  users,
} from "./schema";
import {
  lessonVideosBySubject,
  type SubjectSlug,
} from "./content/lesson-videos";
import { questionBankBySubject } from "./assessment/question-bank";
import {
  literaryWorksByExam,
  type ExamSlugWithReadingList,
} from "./literary-works/data";

function checksumFor(input: string): string {
  return createHash("sha256").update(input).digest("hex");
}

config({ path: ["../../.env.local", "../../.env"], quiet: true });

function derive(password: string, salt: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scryptCallback(
      password,
      salt,
      64,
      { N: 16_384, r: 8, p: 1, maxmem: 64 * 1024 * 1024 },
      (error, key) => (error ? reject(error) : resolve(key)),
    );
  });
}

async function passwordHash(password: string) {
  const salt = randomBytes(16).toString("base64url");
  const hash = await derive(password, salt);
  return `scrypt$16384$8$1$${salt}$${hash.toString("base64url")}`;
}

async function upsertEditorialUser(input: {
  email: string;
  name: string;
  role: "editor" | "reviewer";
  password: string;
}) {
  const db = getDatabase();
  const [created] = await db
    .insert(users)
    .values({
      email: input.email,
      displayName: input.name,
      role: input.role,
      passwordHash: await passwordHash(input.password),
    })
    .onConflictDoNothing()
    .returning({ id: users.id });
  const existing =
    created ??
    (
      await db
        .select({ id: users.id })
        .from(users)
        .where(
          and(
            sql`lower(${users.email}) = ${input.email}`,
            eq(users.status, "active"),
          ),
        )
        .limit(1)
    )[0];
  if (!existing) throw new Error(`Não foi possível preparar ${input.email}.`);
  await db
    .insert(profiles)
    .values({ userId: existing.id })
    .onConflictDoNothing();
  const [existingConsent] = await db
    .select({ id: consents.id })
    .from(consents)
    .where(
      and(
        eq(consents.userId, existing.id),
        eq(consents.purpose, "privacy_policy"),
        eq(consents.policyVersion, "2026-08-11"),
      ),
    )
    .limit(1);
  if (!existingConsent) {
    await db.insert(consents).values({
      userId: existing.id,
      purpose: "privacy_policy",
      policyVersion: "2026-08-11",
      granted: true,
    });
  }
  return existing.id;
}

async function seed() {
  const editorPassword = process.env.SEED_EDITOR_PASSWORD;
  const reviewerPassword = process.env.SEED_REVIEWER_PASSWORD;
  if (!editorPassword || !reviewerPassword) {
    throw new Error(
      "Defina SEED_EDITOR_PASSWORD e SEED_REVIEWER_PASSWORD no .env.",
    );
  }

  const editorId = await upsertEditorialUser({
    email: "editor@aprendevest.local",
    name: "Editora de demonstração",
    role: "editor",
    password: editorPassword,
  });
  const reviewerId = await upsertEditorialUser({
    email: "revisor@aprendevest.local",
    name: "Revisor de demonstração",
    role: "reviewer",
    password: reviewerPassword,
  });
  const now = new Date();

  await getDatabase()
    .insert(exams)
    .values([
      {
        slug: "enem",
        name: "Exame Nacional do Ensino Médio",
        acronym: "ENEM",
        institution: "INEP",
        board: "INEP",
        region: "Brasil",
        officialUrl:
          "https://www.gov.br/inep/pt-br/areas-de-atuacao/avaliacao-e-exames-educacionais/enem",
        sourceUrl:
          "https://www.gov.br/inep/pt-br/areas-de-atuacao/avaliacao-e-exames-educacionais/enem",
        summary:
          "Avaliação nacional organizada em quatro áreas do conhecimento e redação.",
        rightsStatus: "official_link",
        status: "published",
        authorId: editorId,
        reviewerId,
        verifiedAt: now,
        publishedAt: now,
      },
      {
        slug: "fuvest",
        name: "Vestibular da Universidade de São Paulo",
        acronym: "FUVEST",
        institution: "Universidade de São Paulo",
        board: "FUVEST",
        region: "São Paulo",
        officialUrl: "https://www.fuvest.br/",
        sourceUrl: "https://www.fuvest.br/",
        summary:
          "Processo seletivo da USP com formato e regras versionados por edição.",
        rightsStatus: "official_link",
        status: "published",
        authorId: editorId,
        reviewerId,
        verifiedAt: now,
        publishedAt: now,
      },
      {
        slug: "unicamp",
        name: "Vestibular da Universidade Estadual de Campinas",
        acronym: "UNICAMP",
        institution: "Universidade Estadual de Campinas",
        board: "COMVEST",
        region: "São Paulo",
        officialUrl: "https://www.comvest.unicamp.br/",
        sourceUrl: "https://www.comvest.unicamp.br/vestibulares-anteriores/",
        summary: "Seleção da Unicamp com primeira e segunda fases e redação.",
        rightsStatus: "official_link",
        status: "published",
        authorId: editorId,
        reviewerId,
        verifiedAt: now,
        publishedAt: now,
      },
      {
        slug: "uerj",
        name: "Vestibular Estadual do Rio de Janeiro",
        acronym: "UERJ",
        institution: "Universidade do Estado do Rio de Janeiro",
        board: "CEPUERJ",
        region: "Rio de Janeiro",
        officialUrl: "https://www.cepuerj.uerj.br/",
        sourceUrl: "https://www.cepuerj.uerj.br/",
        summary:
          "Processo seletivo da UERJ com exame de qualificação e discursiva-objetiva.",
        rightsStatus: "official_link",
        status: "published",
        authorId: editorId,
        reviewerId,
        verifiedAt: now,
        publishedAt: now,
      },
      {
        slug: "unesp",
        name: "Vestibular da Universidade Estadual Paulista",
        acronym: "UNESP",
        institution: "Universidade Estadual Paulista",
        board: "VUNESP",
        region: "São Paulo",
        officialUrl: "https://www.vunesp.com.br/",
        sourceUrl: "https://www.vunesp.com.br/",
        summary:
          "Processo seletivo da Unesp aplicado pela Vunesp, sem lista de leituras obrigatórias.",
        rightsStatus: "official_link",
        status: "published",
        authorId: editorId,
        reviewerId,
        verifiedAt: now,
        publishedAt: now,
      },
      {
        slug: "ufpr",
        name: "Vestibular da Universidade Federal do Paraná",
        acronym: "UFPR",
        institution: "Universidade Federal do Paraná",
        board: "NC-UFPR",
        region: "Paraná",
        officialUrl: "https://www.nc.ufpr.br/",
        sourceUrl: "https://www.nc.ufpr.br/",
        summary:
          "Processo seletivo da UFPR conduzido pelo Núcleo de Concursos.",
        rightsStatus: "official_link",
        status: "published",
        authorId: editorId,
        reviewerId,
        verifiedAt: now,
        publishedAt: now,
      },
      {
        slug: "ufrgs",
        name: "Vestibular da Universidade Federal do Rio Grande do Sul",
        acronym: "UFRGS",
        institution: "Universidade Federal do Rio Grande do Sul",
        board: "COPERSE",
        region: "Rio Grande do Sul",
        officialUrl: "https://www.ufrgs.br/coperse/",
        sourceUrl: "https://www.ufrgs.br/coperse/",
        summary: "Processo seletivo da UFRGS conduzido pela COPERSE.",
        rightsStatus: "official_link",
        status: "published",
        authorId: editorId,
        reviewerId,
        verifiedAt: now,
        publishedAt: now,
      },
    ])
    .onConflictDoNothing();

  const subjectData = [
    [
      "matematica",
      "Matemática",
      "mathematics",
      "Aritmética, álgebra, funções, geometria, estatística e probabilidade.",
    ],
    [
      "lingua-portuguesa",
      "Língua Portuguesa",
      "languages",
      "Interpretação, gramática, literatura e produção de texto.",
    ],
    [
      "biologia",
      "Biologia",
      "natural_sciences",
      "Citologia, genética, evolução, ecologia e fisiologia.",
    ],
    [
      "historia",
      "História",
      "human_sciences",
      "Processos históricos do Brasil e do mundo em perspectiva crítica.",
    ],
    [
      "quimica",
      "Química",
      "natural_sciences",
      "Química orgânica, inorgânica, estequiometria, termoquímica e eletroquímica.",
    ],
    [
      "fisica",
      "Física",
      "natural_sciences",
      "Mecânica, termologia, eletricidade, óptica e ondulatória.",
    ],
  ] as const;

  const questionIdsByDifficulty: Record<1 | 2 | 3, string[]> = {
    1: [],
    2: [],
    3: [],
  };

  for (const [slug, name, area, summary] of subjectData) {
    const [subject] = await getDatabase()
      .insert(subjects)
      .values({
        slug,
        name,
        area,
        summary,
        status: "published",
        rightsStatus: "platform_authored",
        sourceUrl:
          "https://www.gov.br/inep/pt-br/areas-de-atuacao/avaliacao-e-exames-educacionais/enem/matriz-de-referencia",
        authorId: editorId,
        reviewerId,
        verifiedAt: now,
        publishedAt: now,
      })
      .onConflictDoUpdate({
        target: subjects.slug,
        set: { name, area, summary, updatedAt: now },
      })
      .returning({ id: subjects.id });
    if (!subject) continue;
    const [fundamentosTopic] = await getDatabase()
      .insert(topics)
      .values({
        subjectId: subject.id,
        slug: "fundamentos",
        name: `Fundamentos de ${name}`,
        summary: `Base conceitual para iniciar os estudos de ${name}.`,
        status: "published",
      })
      .onConflictDoUpdate({
        target: [topics.subjectId, topics.slug],
        set: { updatedAt: now },
      })
      .returning({ id: topics.id });
    if (!fundamentosTopic) continue;

    for (const bankQuestion of questionBankBySubject[slug as SubjectSlug] ??
      []) {
      const [insertedQuestion] = await getDatabase()
        .insert(questions)
        .values({
          topicId: fundamentosTopic.id,
          type: "multiple_choice",
          prompt: bankQuestion.prompt,
          options: bankQuestion.options,
          correctAnswer: bankQuestion.correctAnswer,
          resolution: bankQuestion.resolution,
          commonError: bankQuestion.commonError,
          difficulty: bankQuestion.difficulty,
          sourceUrl: "https://aprendevest.com/conteudo-autoral",
          checksum: checksumFor(`${slug}-${bankQuestion.slug}`),
          rightsStatus: "platform_authored",
          status: "published",
          authorId: editorId,
          reviewerId,
          publishedAt: now,
        })
        .onConflictDoUpdate({
          target: questions.checksum,
          set: { updatedAt: now },
        })
        .returning({ id: questions.id });
      if (insertedQuestion) {
        questionIdsByDifficulty[bankQuestion.difficulty].push(
          insertedQuestion.id,
        );
      }
    }

    const subtopics = lessonVideosBySubject[slug as SubjectSlug] ?? [];
    if (!subtopics.length) continue;
    const [videoModule] = await getDatabase()
      .insert(curriculumModules)
      .values({
        subjectId: subject.id,
        slug: "videoaulas",
        title: `Vídeo-aulas de ${name}`,
        summary: `Videoaulas selecionadas para reforçar os principais temas de ${name} cobrados no ENEM e vestibulares.`,
        objectives: [`Revisar os temas centrais de ${name} por vídeo`],
        status: "published",
      })
      .onConflictDoUpdate({
        target: [curriculumModules.subjectId, curriculumModules.slug],
        set: { updatedAt: now },
      })
      .returning({ id: curriculumModules.id });
    if (!videoModule) continue;

    // Frente = grouping topic above the módulo (Área → Matéria → Frente → Módulo → Aula).
    const frenteIdBySlug = new Map<string, string>();
    for (const subtopic of subtopics) {
      if (frenteIdBySlug.has(subtopic.frenteSlug)) continue;
      const [frente] = await getDatabase()
        .insert(topics)
        .values({
          subjectId: subject.id,
          slug: subtopic.frenteSlug,
          name: subtopic.frenteName,
          summary: `Frente de ${name}: ${subtopic.frenteName}.`,
          status: "published",
        })
        .onConflictDoUpdate({
          target: [topics.subjectId, topics.slug],
          set: { name: subtopic.frenteName, updatedAt: now },
        })
        .returning({ id: topics.id });
      if (frente) frenteIdBySlug.set(subtopic.frenteSlug, frente.id);
    }

    for (const subtopic of subtopics) {
      const parentId = frenteIdBySlug.get(subtopic.frenteSlug) ?? null;
      const [topic] = await getDatabase()
        .insert(topics)
        .values({
          subjectId: subject.id,
          parentId,
          slug: subtopic.slug,
          name: subtopic.name,
          summary: `Tópico de ${name} recorrente no ENEM e em vestibulares: ${subtopic.name}.`,
          status: "published",
        })
        .onConflictDoUpdate({
          target: [topics.subjectId, topics.slug],
          set: { parentId, updatedAt: now },
        })
        .returning({ id: topics.id });
      if (!topic) continue;
      await getDatabase()
        .insert(contentItems)
        .values({
          moduleId: videoModule.id,
          topicId: topic.id,
          slug: `${slug}-${subtopic.slug}`,
          type: "video",
          title: subtopic.name,
          summary: `Videoaula "${subtopic.videoTitle}", pelo canal ${subtopic.channel}.`,
          body: [
            { type: "heading", text: subtopic.name },
            {
              type: "paragraph",
              text: `Assista à videoaula acima para revisar ${subtopic.name.toLowerCase()}. Conteúdo pelo canal ${subtopic.channel}.`,
            },
          ],
          objectives: [`Revisar os principais conceitos de ${subtopic.name}`],
          estimatedMinutes: subtopic.estimatedMinutes,
          level: "basico",
          pedagogicalType: subtopic.videoTitle.toLowerCase().includes("resumo")
            ? "revisao"
            : "teoria",
          examTags: ["ENEM"],
          prerequisiteSummary: subtopic.prerequisiteSummary ?? null,
          mediaUrl: subtopic.videoUrl,
          accessibleText: `Videoaula "${subtopic.videoTitle}", do canal ${subtopic.channel}, sobre ${subtopic.name}.`,
          sourceUrl: subtopic.videoUrl,
          rightsStatus: "official_link",
          status: "published",
          authorId: editorId,
          reviewerId,
          verifiedAt: now,
          publishedAt: now,
        })
        .onConflictDoUpdate({
          target: contentItems.slug,
          set: {
            level: "basico",
            pedagogicalType: subtopic.videoTitle
              .toLowerCase()
              .includes("resumo")
              ? "revisao"
              : "teoria",
            examTags: ["ENEM"],
            prerequisiteSummary: subtopic.prerequisiteSummary ?? null,
            updatedAt: now,
          },
        });
    }
  }

  const [mathSubject] = await getDatabase()
    .select({ id: subjects.id })
    .from(subjects)
    .where(eq(subjects.slug, "matematica"))
    .limit(1);
  if (!mathSubject)
    throw new Error("Matéria de Matemática não encontrada no seed.");
  const [mathTopic] = await getDatabase()
    .select({ id: topics.id })
    .from(topics)
    .where(
      and(eq(topics.subjectId, mathSubject.id), eq(topics.slug, "fundamentos")),
    )
    .limit(1);
  if (!mathTopic)
    throw new Error("Tópico de Matemática não encontrado no seed.");

  const [createdModule] = await getDatabase()
    .insert(curriculumModules)
    .values({
      subjectId: mathSubject.id,
      slug: "funcoes",
      title: "Funções",
      summary: "Representações, propriedades e aplicações de funções.",
      objectives: [
        "Reconhecer relações funcionais",
        "Interpretar tabelas e gráficos",
      ],
      status: "published",
    })
    .onConflictDoNothing()
    .returning({ id: curriculumModules.id });
  const moduleRow =
    createdModule ??
    (
      await getDatabase()
        .select({ id: curriculumModules.id })
        .from(curriculumModules)
        .where(
          and(
            eq(curriculumModules.subjectId, mathSubject.id),
            eq(curriculumModules.slug, "funcoes"),
          ),
        )
        .limit(1)
    )[0];
  if (!moduleRow) throw new Error("Módulo de Funções não encontrado no seed.");

  await getDatabase()
    .insert(contentItems)
    .values({
      moduleId: moduleRow.id,
      topicId: mathTopic.id,
      slug: "funcoes-primeiros-passos",
      type: "lesson",
      title: "Funções: primeiros passos",
      summary:
        "Entenda relação, domínio, imagem e como reconhecer uma função em tabelas e gráficos.",
      body: [
        { type: "heading", text: "O que é uma função?" },
        {
          type: "paragraph",
          text: "Uma função associa cada elemento do domínio a exatamente um elemento do contradomínio.",
        },
        {
          type: "example",
          title: "Temperatura ao longo do dia",
          text: "Se cada horário possui uma única temperatura medida, a relação horário → temperatura é uma função.",
        },
        {
          type: "check",
          question:
            "Uma entrada pode ter duas saídas diferentes em uma função?",
          answer: "Não. Cada entrada deve estar associada a uma única saída.",
        },
      ],
      objectives: [
        "Reconhecer uma função",
        "Identificar domínio e imagem",
        "Interpretar representações simples",
      ],
      estimatedMinutes: 25,
      accessibleText:
        "Funções associam cada entrada a uma única saída. Domínio é o conjunto de entradas; imagem reúne as saídas obtidas.",
      sourceUrl:
        "https://curriculo.sedu.es.gov.br/curriculo/wp-content/uploads/2020/02/BNCC_EnsinoMedio_embaixa_site_110518.pdf",
      rightsStatus: "platform_authored",
      status: "published",
      authorId: editorId,
      reviewerId,
      verifiedAt: now,
      publishedAt: now,
    })
    .onConflictDoNothing();

  await getDatabase()
    .insert(questions)
    .values({
      topicId: mathTopic.id,
      type: "multiple_choice",
      prompt: "Considere f(x) = 2x + 1. Qual é o valor de f(3)?",
      options: [
        { id: "a", text: "5" },
        { id: "b", text: "6" },
        { id: "c", text: "7" },
        { id: "d", text: "8" },
      ],
      correctAnswer: "c",
      resolution: "Substitua x por 3: f(3) = 2 · 3 + 1 = 6 + 1 = 7.",
      commonError: "Esquecer de somar o termo constante após a multiplicação.",
      difficulty: 1,
      sourceUrl: "https://aprendevest.com/conteudo-autoral",
      checksum:
        "d601b51bed9bc954762ed43847005a7255c7e770fba47a1c5425158cc298e0af",
      rightsStatus: "platform_authored",
      status: "published",
      authorId: editorId,
      reviewerId,
      publishedAt: now,
    })
    .onConflictDoNothing();

  const [enem] = await getDatabase()
    .select({ id: exams.id })
    .from(exams)
    .where(eq(exams.slug, "enem"))
    .limit(1);
  const [seedQuestion] = await getDatabase()
    .select({ id: questions.id })
    .from(questions)
    .where(
      eq(
        questions.checksum,
        "d601b51bed9bc954762ed43847005a7255c7e770fba47a1c5425158cc298e0af",
      ),
    )
    .limit(1);
  if (enem && seedQuestion) {
    const [newEdition] = await getDatabase()
      .insert(examEditions)
      .values({
        examId: enem.id,
        year: 2025,
        editionLabel: "Demonstração",
        rulesSourceUrl:
          "https://www.gov.br/inep/pt-br/areas-de-atuacao/avaliacao-e-exames-educacionais/enem/provas-e-gabaritos",
        verifiedAt: now,
      })
      .onConflictDoNothing()
      .returning({ id: examEditions.id });
    const edition =
      newEdition ??
      (
        await getDatabase()
          .select({ id: examEditions.id })
          .from(examEditions)
          .where(
            and(eq(examEditions.examId, enem.id), eq(examEditions.year, 2025)),
          )
          .limit(1)
      )[0];
    if (edition) {
      const [paper] = await getDatabase()
        .insert(examPapers)
        .values({
          editionId: edition.id,
          slug: "enem-demonstrativo-2025",
          title: "ENEM 2025 — caderno demonstrativo",
          durationMinutes: 90,
          officialUrl:
            "https://www.gov.br/inep/pt-br/areas-de-atuacao/avaliacao-e-exames-educacionais/enem/provas-e-gabaritos",
          checksum:
            "1f3146f5273bb6b0bc0247fb8cd19ce1802cc4610a951c13d9269f45881c5d2a",
          rightsStatus: "official_link",
          status: "published",
        })
        .onConflictDoNothing()
        .returning({ id: examPapers.id });
      if (paper)
        await getDatabase()
          .insert(examPaperQuestions)
          .values({
            paperId: paper.id,
            questionId: seedQuestion.id,
            position: 1,
          })
          .onConflictDoNothing();
    }
  }

  const [fuvest] = await getDatabase()
    .select({ id: exams.id })
    .from(exams)
    .where(eq(exams.slug, "fuvest"))
    .limit(1);
  const [unicamp] = await getDatabase()
    .select({ id: exams.id })
    .from(exams)
    .where(eq(exams.slug, "unicamp"))
    .limit(1);
  const [uerj] = await getDatabase()
    .select({ id: exams.id })
    .from(exams)
    .where(eq(exams.slug, "uerj"))
    .limit(1);

  const pastPapers = [
    ...(enem
      ? [2022, 2023, 2024].map((year) => ({
          examId: enem.id,
          slug: `enem-${year}`,
          title: `ENEM ${year} — 1º dia (caderno azul)`,
          day: 1,
          phase: null as string | null,
          durationMinutes: 330,
          officialUrl:
            "https://www.gov.br/inep/pt-br/areas-de-atuacao/avaliacao-e-exames-educacionais/enem/provas-e-gabaritos",
          rulesSourceUrl:
            "https://www.gov.br/inep/pt-br/areas-de-atuacao/avaliacao-e-exames-educacionais/enem/provas-e-gabaritos",
          editionLabel: `${year}`,
          year,
          difficulty: 1 as 1 | 2 | 3,
        }))
      : []),
    ...(fuvest
      ? [2023, 2024].map((year) => ({
          examId: fuvest.id,
          slug: `fuvest-${year}`,
          title: `FUVEST ${year} — 1ª fase`,
          day: 1,
          phase: "1ª fase",
          durationMinutes: 300,
          officialUrl: "https://www.fuvest.br/acervo",
          rulesSourceUrl: "https://www.fuvest.br/acervo",
          editionLabel: `${year}`,
          year,
          difficulty: 2 as 1 | 2 | 3,
        }))
      : []),
    ...(unicamp
      ? [2024].map((year) => ({
          examId: unicamp.id,
          slug: `unicamp-${year}`,
          title: `UNICAMP ${year} — 1ª fase`,
          day: 1,
          phase: "1ª fase",
          durationMinutes: 240,
          officialUrl:
            "https://www.comvest.unicamp.br/vestibulares-anteriores/",
          rulesSourceUrl:
            "https://www.comvest.unicamp.br/vestibulares-anteriores/",
          editionLabel: `${year}`,
          year,
          difficulty: 3 as 1 | 2 | 3,
        }))
      : []),
    ...(uerj
      ? [2024].map((year) => ({
          examId: uerj.id,
          slug: `uerj-${year}`,
          title: `UERJ ${year} — Exame de qualificação`,
          day: 1,
          phase: "Qualificação",
          durationMinutes: 180,
          officialUrl: "https://www.cepuerj.uerj.br/",
          rulesSourceUrl: "https://www.cepuerj.uerj.br/",
          editionLabel: `${year}`,
          year,
          difficulty: 2 as 1 | 2 | 3,
        }))
      : []),
  ];

  for (const past of pastPapers) {
    const [pastEdition] = await getDatabase()
      .insert(examEditions)
      .values({
        examId: past.examId,
        year: past.year,
        editionLabel: past.editionLabel,
        rulesSourceUrl: past.rulesSourceUrl,
        verifiedAt: now,
      })
      .onConflictDoNothing()
      .returning({ id: examEditions.id });
    if (!pastEdition) continue;
    const [pastPaper] = await getDatabase()
      .insert(examPapers)
      .values({
        editionId: pastEdition.id,
        slug: past.slug,
        title: past.title,
        phase: past.phase,
        day: past.day,
        durationMinutes: past.durationMinutes,
        officialUrl: past.officialUrl,
        checksum: checksumFor(past.slug),
        rightsStatus: "official_link",
        status: "published",
      })
      .onConflictDoNothing()
      .returning({ id: examPapers.id });
    if (!pastPaper) continue;
    const tierQuestionIds = questionIdsByDifficulty[past.difficulty];
    for (const [position, questionId] of tierQuestionIds.entries()) {
      await getDatabase()
        .insert(examPaperQuestions)
        .values({ paperId: pastPaper.id, questionId, position: position + 1 })
        .onConflictDoNothing();
    }
  }

  for (const [examSlug, edition] of Object.entries(literaryWorksByExam) as [
    ExamSlugWithReadingList,
    (typeof literaryWorksByExam)[ExamSlugWithReadingList],
  ][]) {
    const [readingListExam] = await getDatabase()
      .select({ id: exams.id })
      .from(exams)
      .where(eq(exams.slug, examSlug))
      .limit(1);
    if (!readingListExam) continue;
    for (const work of edition.works) {
      await getDatabase()
        .insert(literaryWorks)
        .values({
          examId: readingListExam.id,
          editionYear: edition.editionYear,
          title: work.title,
          author: work.author,
          sourceUrl: work.sourceUrl,
          notes: work.notes ?? null,
          status: "published",
        })
        .onConflictDoUpdate({
          target: [
            literaryWorks.examId,
            literaryWorks.editionYear,
            literaryWorks.title,
          ],
          set: {
            author: work.author,
            sourceUrl: work.sourceUrl,
            notes: work.notes ?? null,
            updatedAt: now,
          },
        });
    }
  }

  await getDatabase()
    .insert(featureFlags)
    .values([
      {
        key: "essays",
        description: "Módulo privado de redação e correção humana.",
        enabled: true,
        rolloutPercent: 100,
        updatedBy: editorId,
      },
      {
        key: "ai_tutor",
        description: "Tutor RAG; permanece desligado sem avaliação editorial.",
        enabled: false,
        rolloutPercent: 0,
        updatedBy: editorId,
      },
      {
        key: "teachers",
        description: "Painel de professores e turmas.",
        enabled: false,
        rolloutPercent: 0,
        updatedBy: editorId,
      },
      {
        key: "billing",
        description: "Cobrança opcional sem bloquear o núcleo gratuito.",
        enabled: false,
        rolloutPercent: 0,
        updatedBy: editorId,
      },
    ])
    .onConflictDoNothing();

  await getDatabase()
    .insert(essayThemes)
    .values({
      slug: "tecnologia-e-participacao-cidada",
      title: "Tecnologia e participação cidadã no Brasil",
      prompt:
        "Produza um texto dissertativo-argumentativo sobre como a tecnologia pode ampliar a participação cidadã sem aprofundar desigualdades.",
      supportingTexts: [],
      examLabel: "Tema autoral demonstrativo",
      sourceUrl: "https://aprendevest.com/metodologia",
      rightsStatus: "platform_authored",
      status: "published",
      authorId: editorId,
      reviewerId,
      verifiedAt: now,
      publishedAt: now,
    })
    .onConflictDoNothing();
}

seed()
  .then(() => {
    console.log("Seed sintético concluído.");
    process.exit(0);
  })
  .catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
