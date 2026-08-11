import { randomBytes, scrypt as scryptCallback } from "node:crypto";
import { config } from "dotenv";
import { and, eq, sql } from "drizzle-orm";

import { getDatabase } from "./client";
import { consents, exams, profiles, subjects, topics, users } from "./schema";

config({ path: "../../.env", quiet: true });

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
    if (subject) {
      await getDatabase()
        .insert(topics)
        .values({
          subjectId: subject.id,
          slug: "fundamentos",
          name: `Fundamentos de ${name}`,
          summary: `Base conceitual para iniciar os estudos de ${name}.`,
          status: "published",
        });
    }
  }
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
