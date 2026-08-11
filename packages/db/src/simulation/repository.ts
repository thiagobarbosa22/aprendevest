import type {
  SimulationStartInput,
  SimulationUpdateInput,
} from "@aprendevest/contracts";
import { analyzeSimulation } from "@aprendevest/domain";
import { and, asc, eq, inArray } from "drizzle-orm";
import { getDatabase } from "../client";
import { questions, simulationRuns } from "../schema";

export async function startSimulation(
  userId: string,
  input: SimulationStartInput,
) {
  const db = getDatabase();
  const selected = await db
    .select({ id: questions.id, version: questions.version })
    .from(questions)
    .where(eq(questions.status, "published"))
    .orderBy(asc(questions.createdAt))
    .limit(input.questionCount);
  if (!selected.length)
    throw new Error("Nenhuma questão publicada disponível.");
  const [run] = await db
    .insert(simulationRuns)
    .values({
      userId,
      mode: input.mode,
      questionIds: selected.map((item) => item.id),
      questionVersions: Object.fromEntries(
        selected.map((item) => [item.id, item.version]),
      ),
      durationMinutes: input.durationMinutes,
    })
    .returning();
  if (!run) throw new Error("Não foi possível iniciar o simulado.");
  return { run, questions: await getSimulationQuestions(run.id, userId) };
}

export async function getSimulationQuestions(runId: string, userId: string) {
  const db = getDatabase();
  const [run] = await db
    .select()
    .from(simulationRuns)
    .where(and(eq(simulationRuns.id, runId), eq(simulationRuns.userId, userId)))
    .limit(1);
  if (!run) throw new Error("Simulado não encontrado.");
  if (!run.questionIds.length) return [];
  const selected = await db
    .select({
      id: questions.id,
      prompt: questions.prompt,
      options: questions.options,
    })
    .from(questions)
    .where(inArray(questions.id, run.questionIds));
  return run.questionIds
    .map((id) => selected.find((question) => question.id === id))
    .filter((question): question is NonNullable<typeof question> =>
      Boolean(question),
    );
}

export async function updateSimulation(
  userId: string,
  input: SimulationUpdateInput,
) {
  const db = getDatabase();
  const [run] = await db
    .select()
    .from(simulationRuns)
    .where(
      and(
        eq(simulationRuns.id, input.runId),
        eq(simulationRuns.userId, userId),
      ),
    )
    .limit(1);
  if (!run) throw new Error("Simulado não encontrado.");
  if (run.status !== "in_progress") throw new Error("Simulado já finalizado.");
  const answers = { ...run.answers, ...input.answers };
  const elapsedSeconds = Math.max(run.elapsedSeconds, input.elapsedSeconds);
  let result = run.result;
  if (input.submit) {
    const selected = await db
      .select({
        id: questions.id,
        topicId: questions.topicId,
        correctAnswer: questions.correctAnswer,
      })
      .from(questions)
      .where(inArray(questions.id, run.questionIds));
    result = analyzeSimulation(
      selected.map((question) => ({
        questionId: question.id,
        topicId: question.topicId,
        answer: answers[question.id],
        correctAnswer: question.correctAnswer,
      })),
    );
  }
  const [saved] = await db
    .update(simulationRuns)
    .set({
      answers,
      elapsedSeconds,
      status: input.submit ? "submitted" : "in_progress",
      result,
      submittedAt: input.submit ? new Date() : null,
      updatedAt: new Date(),
    })
    .where(eq(simulationRuns.id, run.id))
    .returning();
  return saved;
}

export async function listSimulationHistory(userId: string) {
  return getDatabase()
    .select({
      id: simulationRuns.id,
      mode: simulationRuns.mode,
      status: simulationRuns.status,
      result: simulationRuns.result,
      startedAt: simulationRuns.startedAt,
      elapsedSeconds: simulationRuns.elapsedSeconds,
    })
    .from(simulationRuns)
    .where(eq(simulationRuns.userId, userId))
    .orderBy(asc(simulationRuns.startedAt));
}
