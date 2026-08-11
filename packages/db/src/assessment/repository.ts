import type { QuestionAttemptInput } from "@aprendevest/contracts";
import { evaluateObjectiveAnswer } from "@aprendevest/domain";
import { and, desc, eq, isNull } from "drizzle-orm";
import { getDatabase, isDatabaseConfigured } from "../client";
import { attempts, errorNotebook, questions, topics } from "../schema";
import { questionBankBySubject } from "./question-bank";

const subjectNames: Record<string, string> = {
  matematica: "Matemática",
  "lingua-portuguesa": "Língua Portuguesa",
  biologia: "Biologia",
  historia: "História",
  quimica: "Química",
  fisica: "Física",
};

export const demoQuestions = Object.entries(questionBankBySubject).flatMap(
  ([subjectSlug, bankQuestions]) =>
    bankQuestions.map((question) => ({
      id: `demo-${subjectSlug}-${question.slug}`,
      prompt: question.prompt,
      options: question.options,
      difficulty: question.difficulty,
      topicName: subjectNames[subjectSlug] ?? subjectSlug,
      sourceUrl: "https://aprendevest.com/conteudo-autoral",
      rightsStatus: "platform_authored" as const,
      version: 1,
    })),
);

export async function listPublishedQuestions() {
  if (!isDatabaseConfigured()) return demoQuestions;
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
