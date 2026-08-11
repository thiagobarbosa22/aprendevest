import type { ExamRunUpdateInput } from "@aprendevest/contracts";
import { mergeExamRun } from "@aprendevest/domain";
import { and, eq } from "drizzle-orm";
import { getDatabase, isDatabaseConfigured } from "../client";
import {
  examEditions,
  examPaperQuestions,
  examPapers,
  examRuns,
  exams,
  questions,
} from "../schema";

export const demoPaper = {
  id: "2dcd5143-d7bd-42dd-85ed-09bb95d47cd2",
  slug: "enem-demonstrativo-2025",
  title: "ENEM 2025 — caderno demonstrativo",
  acronym: "ENEM",
  year: 2025,
  durationMinutes: 90,
  officialUrl:
    "https://www.gov.br/inep/pt-br/areas-de-atuacao/avaliacao-e-exames-educacionais/enem/provas-e-gabaritos",
  rightsStatus: "official_link" as const,
  version: 1,
};

const enemOfficialUrl =
  "https://www.gov.br/inep/pt-br/areas-de-atuacao/avaliacao-e-exames-educacionais/enem/provas-e-gabaritos";

export const demoPapers = [
  demoPaper,
  ...[2022, 2023, 2024].map((year) => ({
    id: `demo-enem-${year}`,
    slug: `enem-${year}`,
    title: `ENEM ${year} — 1º dia (caderno azul)`,
    acronym: "ENEM",
    year,
    durationMinutes: 330,
    officialUrl: enemOfficialUrl,
    rightsStatus: "official_link" as const,
    version: 1,
  })),
  ...[2023, 2024].map((year) => ({
    id: `demo-fuvest-${year}`,
    slug: `fuvest-${year}`,
    title: `FUVEST ${year} — 1ª fase`,
    acronym: "FUVEST",
    year,
    durationMinutes: 300,
    officialUrl: "https://www.fuvest.br/acervo",
    rightsStatus: "official_link" as const,
    version: 1,
  })),
];

export async function listPublishedPapers() {
  if (!isDatabaseConfigured()) return demoPapers;
  return getDatabase()
    .select({
      id: examPapers.id,
      slug: examPapers.slug,
      title: examPapers.title,
      acronym: exams.acronym,
      year: examEditions.year,
      durationMinutes: examPapers.durationMinutes,
      officialUrl: examPapers.officialUrl,
      rightsStatus: examPapers.rightsStatus,
      version: examPapers.version,
    })
    .from(examPapers)
    .innerJoin(examEditions, eq(examPapers.editionId, examEditions.id))
    .innerJoin(exams, eq(examEditions.examId, exams.id))
    .where(eq(examPapers.status, "published"));
}
export async function getPublishedPaper(slug: string) {
  return (await listPublishedPapers()).find((p) => p.slug === slug) ?? null;
}
export async function startExamRun(userId: string, paperId: string) {
  const db = getDatabase();
  const [existing] = await db
    .select()
    .from(examRuns)
    .where(
      and(
        eq(examRuns.userId, userId),
        eq(examRuns.paperId, paperId),
        eq(examRuns.status, "in_progress"),
      ),
    )
    .limit(1);
  if (existing) return existing;
  const [paper] = await db
    .select()
    .from(examPapers)
    .where(and(eq(examPapers.id, paperId), eq(examPapers.status, "published")))
    .limit(1);
  if (!paper) throw new Error("Prova não encontrada.");
  return (
    await db
      .insert(examRuns)
      .values({ userId, paperId, paperVersion: paper.version })
      .returning()
  )[0];
}
export async function updateExamRun(userId: string, input: ExamRunUpdateInput) {
  const db = getDatabase();
  const [run] = await db
    .select()
    .from(examRuns)
    .where(and(eq(examRuns.id, input.runId), eq(examRuns.userId, userId)))
    .limit(1);
  if (!run) throw new Error("Aplicação não encontrada.");
  if (run.status === "expired") throw new Error("Esta aplicação expirou.");
  const merged = mergeExamRun(
    {
      answers: run.answers,
      elapsedSeconds: run.elapsedSeconds,
      status: run.status,
    },
    input,
  );
  return (
    await db
      .update(examRuns)
      .set({
        ...merged,
        updatedAt: new Date(),
        submittedAt: merged.status === "submitted" ? new Date() : null,
      })
      .where(eq(examRuns.id, run.id))
      .returning()
  )[0];
}
export async function getPaperQuestions(paperId: string) {
  return getDatabase()
    .select({
      id: questions.id,
      prompt: questions.prompt,
      options: questions.options,
      position: examPaperQuestions.position,
    })
    .from(examPaperQuestions)
    .innerJoin(questions, eq(examPaperQuestions.questionId, questions.id))
    .where(eq(examPaperQuestions.paperId, paperId));
}
