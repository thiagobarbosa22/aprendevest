import { randomBytes, scrypt as scryptCallback } from "node:crypto";
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
  profiles,
  questions,
  subjects,
  topics,
  users,
} from "./schema";
import { lessonVideosBySubject, type SubjectSlug } from "./content/lesson-videos";

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
      .onConflictDoNothing()
      .returning({ id: subjects.id });
    if (!subject) continue;
    await getDatabase()
      .insert(topics)
      .values({
        subjectId: subject.id,
        slug: "fundamentos",
        name: `Fundamentos de ${name}`,
        summary: `Base conceitual para iniciar os estudos de ${name}.`,
        status: "published",
      });

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
      .onConflictDoNothing()
      .returning({ id: curriculumModules.id });
    if (!videoModule) continue;

    for (const subtopic of subtopics) {
      const [topic] = await getDatabase()
        .insert(topics)
        .values({
          subjectId: subject.id,
          slug: subtopic.slug,
          name: subtopic.name,
          summary: `Tópico de ${name} recorrente no ENEM e em vestibulares: ${subtopic.name}.`,
          status: "published",
        })
        .onConflictDoNothing()
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
        .onConflictDoNothing();
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
