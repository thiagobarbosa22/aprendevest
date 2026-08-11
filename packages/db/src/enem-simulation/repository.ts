import { and, desc, eq } from "drizzle-orm";

import { getDatabase } from "../client";
import {
  enemQuestionCache,
  enemSimulationRuns,
  type EnemApiQuestion,
  type EnemSimulationQuestionSnapshot,
  type EnemSimulationResult,
} from "../schema";

/** Years covered by api.enem.dev at the time this was wired up. */
export const enemYears = [
  2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012, 2011,
  2010, 2009,
];

export const enemDisciplineLabel: Record<string, string> = {
  linguagens: "Linguagens, Códigos e suas Tecnologias",
  "ciencias-humanas": "Ciências Humanas e suas Tecnologias",
  "ciencias-natureza": "Ciências da Natureza e suas Tecnologias",
  matematica: "Matemática e suas Tecnologias",
};

async function getOrFetchEnemYear(year: number): Promise<EnemApiQuestion[]> {
  const db = getDatabase();
  const [cached] = await db
    .select({ questions: enemQuestionCache.questions })
    .from(enemQuestionCache)
    .where(eq(enemQuestionCache.year, year))
    .limit(1);
  if (cached) return cached.questions;

  const { fetchEnemYear } = await import("./client");
  const questions = await fetchEnemYear(year);
  await db
    .insert(enemQuestionCache)
    .values({ year, questions })
    .onConflictDoUpdate({
      target: enemQuestionCache.year,
      set: { questions, fetchedAt: new Date() },
    });
  return questions;
}

function toSnapshot(question: EnemApiQuestion): EnemSimulationQuestionSnapshot {
  return {
    index: question.index,
    discipline: question.discipline,
    language: question.language,
    context: question.context,
    files: question.files,
    alternativesIntroduction: question.alternativesIntroduction,
    alternatives: question.alternatives.map((alternative) => ({
      letter: alternative.letter,
      text: alternative.text,
      file: alternative.file,
    })),
    correctAlternative: question.correctAlternative,
  };
}

function sanitizeForClient(question: EnemSimulationQuestionSnapshot) {
  const { correctAlternative: _correctAlternative, ...rest } = question;
  return rest;
}

export async function startEnemSimulation(
  userId: string,
  input: { year: number; discipline: string; language?: "ingles" | "espanhol" },
) {
  const yearQuestions = await getOrFetchEnemYear(input.year);
  const preferredLanguage = input.language ?? "ingles";
  const disciplineQuestions = yearQuestions.filter((question) => {
    if (question.discipline !== input.discipline) return false;
    if (question.discipline !== "linguagens") return true;
    return (
      question.language === null || question.language === preferredLanguage
    );
  });
  if (!disciplineQuestions.length) {
    throw new Error("Nenhuma questão encontrada para esse ano e área.");
  }

  const snapshot = disciplineQuestions.map(toSnapshot);
  const db = getDatabase();
  const [run] = await db
    .insert(enemSimulationRuns)
    .values({
      userId,
      year: input.year,
      discipline: input.discipline,
      language: input.discipline === "linguagens" ? preferredLanguage : null,
      questions: snapshot,
    })
    .returning();
  if (!run) throw new Error("Não foi possível iniciar o simulado do ENEM.");

  return { run, questions: snapshot.map(sanitizeForClient) };
}

export async function getEnemSimulationQuestions(
  runId: string,
  userId: string,
) {
  const db = getDatabase();
  const [run] = await db
    .select()
    .from(enemSimulationRuns)
    .where(
      and(
        eq(enemSimulationRuns.id, runId),
        eq(enemSimulationRuns.userId, userId),
      ),
    )
    .limit(1);
  if (!run) throw new Error("Simulado do ENEM não encontrado.");
  return run.questions.map(sanitizeForClient);
}

export async function updateEnemSimulation(
  userId: string,
  input: {
    runId: string;
    answers: Record<string, string>;
    elapsedSeconds: number;
    submit?: boolean;
  },
) {
  const db = getDatabase();
  const [run] = await db
    .select()
    .from(enemSimulationRuns)
    .where(
      and(
        eq(enemSimulationRuns.id, input.runId),
        eq(enemSimulationRuns.userId, userId),
      ),
    )
    .limit(1);
  if (!run) throw new Error("Simulado do ENEM não encontrado.");
  if (run.status === "submitted")
    throw new Error("Este simulado já foi finalizado.");

  const answers = { ...run.answers, ...input.answers };
  const elapsedSeconds = Math.max(run.elapsedSeconds, input.elapsedSeconds);
  let result: EnemSimulationResult | null = run.result;

  if (input.submit) {
    const byDiscipline: EnemSimulationResult["byDiscipline"] = {};
    let answered = 0;
    let correct = 0;
    for (const question of run.questions) {
      const bucket = byDiscipline[question.discipline] ?? {
        total: 0,
        correct: 0,
      };
      bucket.total += 1;
      const answer = answers[String(question.index)];
      if (answer) answered += 1;
      if (answer === question.correctAlternative) {
        correct += 1;
        bucket.correct += 1;
      }
      byDiscipline[question.discipline] = bucket;
    }
    result = {
      total: run.questions.length,
      answered,
      correct,
      accuracyPercent: run.questions.length
        ? Math.round((correct / run.questions.length) * 100)
        : 0,
      byDiscipline,
    };
  }

  const [saved] = await db
    .update(enemSimulationRuns)
    .set({
      answers,
      elapsedSeconds,
      status: input.submit ? "submitted" : "in_progress",
      result,
      updatedAt: new Date(),
      submittedAt: input.submit ? new Date() : null,
    })
    .where(eq(enemSimulationRuns.id, run.id))
    .returning();
  return saved;
}

export async function listEnemSimulationHistory(userId: string) {
  return getDatabase()
    .select({
      id: enemSimulationRuns.id,
      year: enemSimulationRuns.year,
      discipline: enemSimulationRuns.discipline,
      status: enemSimulationRuns.status,
      result: enemSimulationRuns.result,
      startedAt: enemSimulationRuns.startedAt,
    })
    .from(enemSimulationRuns)
    .where(eq(enemSimulationRuns.userId, userId))
    .orderBy(desc(enemSimulationRuns.startedAt));
}
