import type { QuestionAttemptInput } from "@aprendevest/contracts";
import { evaluateObjectiveAnswer } from "@aprendevest/domain";
import { and, desc, eq, isNull } from "drizzle-orm";
import { getDatabase, isDatabaseConfigured } from "../client";
import { attempts, errorNotebook, questions, topics } from "../schema";

export const demoQuestion = {
  id: "16f7773a-9af4-4e27-b760-cfa965fa42b7",
  prompt: "Considere f(x) = 2x + 1. Qual é o valor de f(3)?",
  options: [
    { id: "a", text: "5" },
    { id: "b", text: "6" },
    { id: "c", text: "7" },
    { id: "d", text: "8" },
  ],
  difficulty: 1,
  topicName: "Funções",
  sourceUrl: "https://aprendevest.com/conteudo-autoral",
  rightsStatus: "platform_authored" as const,
  version: 1,
};

export async function listPublishedQuestions() {
  if (!isDatabaseConfigured()) return [demoQuestion];
  return getDatabase()
    .select({
      id: questions.id,
      prompt: questions.prompt,
      options: questions.options,
      difficulty: questions.difficulty,
      topicName: topics.name,
      sourceUrl: questions.sourceUrl,
      rightsStatus: questions.rightsStatus,
      version: questions.version,
    })
    .from(questions)
    .innerJoin(topics, eq(questions.topicId, topics.id))
    .where(eq(questions.status, "published"));
}

export async function submitQuestionAttempt(
  userId: string,
  input: QuestionAttemptInput,
) {
  const db = getDatabase();
  const [question] = await db
    .select()
    .from(questions)
    .where(
      and(
        eq(questions.id, input.questionId),
        eq(questions.status, "published"),
      ),
    )
    .limit(1);
  if (!question) throw new Error("Questão não encontrada.");
  const [existing] = await db
    .select()
    .from(attempts)
    .where(
      and(
        eq(attempts.userId, userId),
        eq(attempts.idempotencyKey, input.idempotencyKey),
      ),
    )
    .limit(1);
  if (existing)
    return {
      ...existing,
      resolution: question.resolution,
      commonError: question.commonError,
      correctAnswer: question.correctAnswer,
    };
  const evaluation = evaluateObjectiveAnswer({
    answer: input.answer,
    correctAnswer: question.correctAnswer,
    durationSeconds: input.durationSeconds,
  });
  return db.transaction(async (tx) => {
    const [attempt] = await tx
      .insert(attempts)
      .values({
        userId,
        ...input,
        correct: evaluation.correct,
        durationSeconds: evaluation.durationSeconds,
        questionVersion: question.version,
      })
      .returning();
    if (!attempt) throw new Error("Falha ao registrar tentativa.");
    if (!evaluation.correct)
      await tx
        .insert(errorNotebook)
        .values({ userId, questionId: question.id, lastAttemptId: attempt.id })
        .onConflictDoUpdate({
          target: [errorNotebook.userId, errorNotebook.questionId],
          set: {
            lastAttemptId: attempt.id,
            resolvedAt: null,
            updatedAt: new Date(),
          },
        });
    else
      await tx
        .update(errorNotebook)
        .set({ resolvedAt: new Date(), updatedAt: new Date() })
        .where(
          and(
            eq(errorNotebook.userId, userId),
            eq(errorNotebook.questionId, question.id),
          ),
        );
    return {
      ...attempt,
      resolution: question.resolution,
      commonError: question.commonError,
      correctAnswer: question.correctAnswer,
    };
  });
}

export async function listErrors(userId: string) {
  return getDatabase()
    .select({
      questionId: questions.id,
      prompt: questions.prompt,
      resolution: questions.resolution,
      classification: errorNotebook.classification,
      updatedAt: errorNotebook.updatedAt,
    })
    .from(errorNotebook)
    .innerJoin(questions, eq(errorNotebook.questionId, questions.id))
    .where(
      and(eq(errorNotebook.userId, userId), isNull(errorNotebook.resolvedAt)),
    )
    .orderBy(desc(errorNotebook.updatedAt));
}
