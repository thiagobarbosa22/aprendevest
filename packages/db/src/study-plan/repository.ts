import type { DiagnosticAnswer } from "@aprendevest/domain";
import {
  buildWeeklyPlan,
  estimateMastery,
  nextReviewDate,
} from "@aprendevest/domain";
import { and, asc, desc, eq, lte } from "drizzle-orm";
import { getDatabase } from "../client";
import {
  diagnostics,
  mastery,
  profiles,
  reviewItems,
  studyPlans,
  studyTasks,
  topics,
} from "../schema";

export async function createStudyPlan(
  userId: string,
  answers: DiagnosticAnswer[] = [],
) {
  const db = getDatabase();
  const [profile] = await db
    .select({ weeklyMinutes: profiles.weeklyMinutes })
    .from(profiles)
    .where(eq(profiles.userId, userId))
    .limit(1);
  if (!profile) throw new Error("Complete seu perfil antes de gerar o plano.");

  const availableTopics = await db
    .select({
      topicId: topics.id,
      title: topics.name,
      estimatedMinutes: topics.estimatedMinutes,
      difficulty: topics.difficulty,
    })
    .from(topics)
    .where(eq(topics.status, "published"))
    .orderBy(asc(topics.position));
  if (!availableTopics.length)
    throw new Error("O catálogo ainda não possui tópicos publicados.");

  const diagnosticMastery = estimateMastery(answers);
  const stored = await db
    .select({
      topicId: mastery.topicId,
      estimatePercent: mastery.estimatePercent,
    })
    .from(mastery)
    .where(eq(mastery.userId, userId));
  const known = new Map(
    stored.map((item) => [item.topicId, item.estimatePercent / 100]),
  );
  const now = new Date();
  const endsAt = new Date(now);
  endsAt.setUTCDate(endsAt.getUTCDate() + 7);

  return db.transaction(async (tx) => {
    let diagnosticId: string | undefined;
    if (answers.length) {
      const [diagnostic] = await tx
        .insert(diagnostics)
        .values({ userId, answers })
        .returning();
      diagnosticId = diagnostic?.id;
      for (const [topicId, estimate] of diagnosticMastery) {
        await tx
          .insert(mastery)
          .values({
            userId,
            topicId,
            estimatePercent: Math.round(estimate * 100),
            evidenceCount: 1,
            evidence: { lastDiagnosticId: diagnosticId },
          })
          .onConflictDoUpdate({
            target: [mastery.userId, mastery.topicId],
            set: {
              estimatePercent: Math.round(estimate * 100),
              evidenceCount: 1,
              evidence: { lastDiagnosticId: diagnosticId },
              updatedAt: now,
            },
          });
      }
    }

    await tx
      .update(studyPlans)
      .set({ status: "archived" })
      .where(
        and(eq(studyPlans.userId, userId), eq(studyPlans.status, "active")),
      );
    const [plan] = await tx
      .insert(studyPlans)
      .values({
        userId,
        weeklyMinutes: profile.weeklyMinutes,
        startsAt: now,
        endsAt,
        explanation:
          "Priorizamos tópicos relevantes com menor domínio e alternamos teoria, prática e revisão dentro do seu tempo semanal.",
      })
      .returning();
    if (!plan) throw new Error("Não foi possível criar o plano.");

    const planned = buildWeeklyPlan(
      availableTopics.map((topic) => ({
        ...topic,
        priority: Math.max(1, 4 - topic.difficulty),
        mastery:
          diagnosticMastery.get(topic.topicId) ??
          known.get(topic.topicId) ??
          0.25,
      })),
      profile.weeklyMinutes,
      now,
    );
    if (planned.length) {
      await tx.insert(studyTasks).values(
        planned.map((task) => ({
          planId: plan.id,
          topicId: task.topicId,
          title: task.title,
          kind: task.kind,
          minutes: task.minutes,
          reason: task.reason,
          scheduledFor: task.scheduledFor,
        })),
      );
    }
    if (diagnosticId) {
      for (const task of planned.filter((item) => item.mastery < 0.4)) {
        await tx
          .insert(reviewItems)
          .values({
            userId,
            topicId: task.topicId,
            sourceType: "diagnostic",
            sourceId: diagnosticId,
            nextReviewAt: now,
          })
          .onConflictDoNothing();
      }
    }
    return plan;
  });
}

export async function listDiagnosticTopics() {
  return getDatabase()
    .select({ id: topics.id, name: topics.name, summary: topics.summary })
    .from(topics)
    .where(eq(topics.status, "published"))
    .orderBy(asc(topics.position));
}

export async function getActiveStudyPlan(userId: string) {
  const db = getDatabase();
  const [plan] = await db
    .select()
    .from(studyPlans)
    .where(and(eq(studyPlans.userId, userId), eq(studyPlans.status, "active")))
    .orderBy(desc(studyPlans.createdAt))
    .limit(1);
  if (!plan) return null;
  const tasks = await db
    .select()
    .from(studyTasks)
    .where(eq(studyTasks.planId, plan.id))
    .orderBy(asc(studyTasks.scheduledFor));
  return { ...plan, tasks };
}

export async function completeStudyTask(userId: string, taskId: string) {
  const db = getDatabase();
  const [task] = await db
    .select({ id: studyTasks.id })
    .from(studyTasks)
    .innerJoin(studyPlans, eq(studyTasks.planId, studyPlans.id))
    .where(and(eq(studyTasks.id, taskId), eq(studyPlans.userId, userId)))
    .limit(1);
  if (!task) throw new Error("Atividade não encontrada.");
  await db
    .update(studyTasks)
    .set({ status: "completed", completedAt: new Date() })
    .where(eq(studyTasks.id, taskId));
}

export async function listDueReviews(userId: string) {
  return getDatabase()
    .select({
      id: reviewItems.id,
      topic: topics.name,
      intervalDays: reviewItems.intervalDays,
      nextReviewAt: reviewItems.nextReviewAt,
    })
    .from(reviewItems)
    .leftJoin(topics, eq(reviewItems.topicId, topics.id))
    .where(
      and(
        eq(reviewItems.userId, userId),
        lte(reviewItems.nextReviewAt, new Date()),
      ),
    )
    .orderBy(asc(reviewItems.nextReviewAt));
}

export async function gradeReview(
  userId: string,
  reviewId: string,
  quality: 0 | 1 | 2 | 3 | 4 | 5,
) {
  const db = getDatabase();
  const [item] = await db
    .select()
    .from(reviewItems)
    .where(and(eq(reviewItems.id, reviewId), eq(reviewItems.userId, userId)))
    .limit(1);
  if (!item) throw new Error("Revisão não encontrada.");
  const next = nextReviewDate(item.intervalDays, quality);
  await db
    .update(reviewItems)
    .set({
      intervalDays: next.intervalDays,
      nextReviewAt: next.date,
      history: [
        ...item.history,
        {
          at: new Date().toISOString(),
          quality,
          intervalDays: next.intervalDays,
        },
      ],
    })
    .where(eq(reviewItems.id, reviewId));
}

export async function getPerformance(userId: string) {
  return getDatabase()
    .select({
      topicId: mastery.topicId,
      topic: topics.name,
      estimatePercent: mastery.estimatePercent,
      evidenceCount: mastery.evidenceCount,
      updatedAt: mastery.updatedAt,
    })
    .from(mastery)
    .innerJoin(topics, eq(mastery.topicId, topics.id))
    .where(eq(mastery.userId, userId))
    .orderBy(asc(mastery.estimatePercent));
}
