import type {
  ContentNoteInput,
  ContentProgressInput,
  LessonDraftInput,
} from "@aprendevest/contracts";
import {
  assertPublishableMetadata,
  canTransitionEditorialStatus,
  mergeContentProgress,
} from "@aprendevest/domain";
import { and, asc, eq } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";

import { getDatabase, isDatabaseConfigured } from "../client";
import {
  auditEvents,
  contentItems,
  contentNotes,
  contentProgress,
  editorialRevisions,
  curriculumModules,
  subjects,
  topics,
} from "../schema";
import { demoLessons } from "./demo";

const frenteTopics = alias(topics, "frente_topics");

export async function listPublishedLessons(subjectSlug?: string) {
  if (!isDatabaseConfigured()) {
    return subjectSlug
      ? demoLessons.filter((item) => item.subjectSlug === subjectSlug)
      : demoLessons;
  }
  const rows = await getDatabase()
    .select({
      id: contentItems.id,
      slug: contentItems.slug,
      title: contentItems.title,
      summary: contentItems.summary,
      subjectSlug: subjects.slug,
      subjectName: subjects.name,
      topicName: topics.name,
      frenteName: frenteTopics.name,
      estimatedMinutes: contentItems.estimatedMinutes,
      objectives: contentItems.objectives,
      body: contentItems.body,
      accessibleText: contentItems.accessibleText,
      sourceUrl: contentItems.sourceUrl,
      rightsStatus: contentItems.rightsStatus,
      version: contentItems.version,
      mediaUrl: contentItems.mediaUrl,
      level: contentItems.level,
      pedagogicalType: contentItems.pedagogicalType,
      examTags: contentItems.examTags,
      prerequisiteSummary: contentItems.prerequisiteSummary,
    })
    .from(contentItems)
    .innerJoin(topics, eq(contentItems.topicId, topics.id))
    .innerJoin(subjects, eq(topics.subjectId, subjects.id))
    .leftJoin(frenteTopics, eq(topics.parentId, frenteTopics.id))
    .where(eq(contentItems.status, "published"))
    .orderBy(asc(contentItems.title));
  return subjectSlug
    ? rows.filter((item) => item.subjectSlug === subjectSlug)
    : rows;
}

export async function getPublishedLesson(slug: string) {
  return (
    (await listPublishedLessons()).find((lesson) => lesson.slug === slug) ??
    null
  );
}

export async function getContentProgress(userId: string, contentId: string) {
  const [progress] = await getDatabase()
    .select()
    .from(contentProgress)
    .where(
      and(
        eq(contentProgress.userId, userId),
        eq(contentProgress.contentId, contentId),
      ),
    )
    .limit(1);
  return progress ?? null;
}

export async function saveContentProgress(
  userId: string,
  input: ContentProgressInput,
) {
  const previous = await getContentProgress(userId, input.contentId);
  const merged = mergeContentProgress(
    previous
      ? {
          percent: previous.percent,
          positionSeconds: previous.positionSeconds,
          status: previous.status,
        }
      : null,
    input,
  );
  const [saved] = await getDatabase()
    .insert(contentProgress)
    .values({
      userId,
      contentId: input.contentId,
      ...merged,
      startedAt: previous?.startedAt ?? new Date(),
      completedAt:
        merged.status === "completed"
          ? (previous?.completedAt ?? new Date())
          : null,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: [contentProgress.userId, contentProgress.contentId],
      set: {
        ...merged,
        completedAt:
          merged.status === "completed"
            ? (previous?.completedAt ?? new Date())
            : null,
        updatedAt: new Date(),
      },
    })
    .returning();
  return saved;
}

export async function addContentNote(userId: string, input: ContentNoteInput) {
  const [note] = await getDatabase()
    .insert(contentNotes)
    .values({ userId, ...input })
    .returning();
  return note;
}

export async function listContentNotes(userId: string, contentId: string) {
  return getDatabase()
    .select()
    .from(contentNotes)
    .where(
      and(
        eq(contentNotes.userId, userId),
        eq(contentNotes.contentId, contentId),
      ),
    )
    .orderBy(asc(contentNotes.createdAt));
}

export async function createLessonDraft(
  input: LessonDraftInput,
  actorId: string,
) {
  const db = getDatabase();
  return db.transaction(async (tx) => {
    const [lesson] = await tx
      .insert(contentItems)
      .values({ ...input, authorId: actorId, verifiedAt: new Date() })
      .returning();
    if (!lesson) throw new Error("Falha ao criar aula.");
    await tx.insert(editorialRevisions).values({
      entityType: "content",
      entityId: lesson.id,
      version: lesson.version,
      status: "draft",
      snapshot: lesson,
      authorId: actorId,
    });
    await tx.insert(auditEvents).values({
      actorUserId: actorId,
      action: "content.lesson_created",
      targetType: "content",
      targetId: lesson.id,
    });
    return lesson;
  });
}

export async function listEditorialContent() {
  return getDatabase()
    .select()
    .from(contentItems)
    .orderBy(asc(contentItems.title));
}

export async function listContentEditorOptions() {
  const db = getDatabase();
  const modules = await db
    .select({ id: curriculumModules.id, title: curriculumModules.title })
    .from(curriculumModules)
    .where(eq(curriculumModules.status, "published"))
    .orderBy(asc(curriculumModules.title));
  const topicOptions = await db
    .select({ id: topics.id, name: topics.name })
    .from(topics)
    .where(eq(topics.status, "published"))
    .orderBy(asc(topics.name));
  return { modules, topics: topicOptions };
}

export async function transitionContentStatus(
  contentId: string,
  to: "in_review" | "approved",
  actorId: string,
) {
  const db = getDatabase();
  return db.transaction(async (tx) => {
    const [item] = await tx
      .select()
      .from(contentItems)
      .where(eq(contentItems.id, contentId))
      .limit(1);
    if (!item) throw new Error("Conteúdo não encontrado.");
    if (!canTransitionEditorialStatus(item.status, to)) {
      throw new Error(`Transição editorial inválida: ${item.status} → ${to}.`);
    }
    const version = item.version + 1;
    const [updated] = await tx
      .update(contentItems)
      .set({
        status: to,
        reviewerId: to === "approved" ? actorId : item.reviewerId,
        version,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(contentItems.id, contentId),
          eq(contentItems.version, item.version),
        ),
      )
      .returning();
    if (!updated) throw new Error("O conteúdo foi alterado. Recarregue.");
    await tx.insert(editorialRevisions).values({
      entityType: "content",
      entityId: item.id,
      version,
      status: to,
      snapshot: updated,
      authorId: item.authorId,
      reviewerId: to === "approved" ? actorId : item.reviewerId,
    });
    return updated;
  });
}

export async function publishContent(contentId: string, actorId: string) {
  const db = getDatabase();
  return db.transaction(async (tx) => {
    const [item] = await tx
      .select()
      .from(contentItems)
      .where(eq(contentItems.id, contentId))
      .limit(1);
    if (!item) throw new Error("Conteúdo não encontrado.");
    if (!canTransitionEditorialStatus(item.status, "published")) {
      throw new Error("O conteúdo precisa estar aprovado.");
    }
    assertPublishableMetadata({
      sourceUrl: item.sourceUrl,
      rightsStatus:
        item.rightsStatus === "under_review" ? null : item.rightsStatus,
      authorId: item.authorId,
      reviewerId: item.reviewerId,
    });
    const version = item.version + 1;
    const [published] = await tx
      .update(contentItems)
      .set({
        status: "published",
        version,
        publishedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(contentItems.id, contentId),
          eq(contentItems.version, item.version),
        ),
      )
      .returning();
    if (!published) throw new Error("O conteúdo foi alterado. Recarregue.");
    await tx.insert(editorialRevisions).values({
      entityType: "content",
      entityId: item.id,
      version,
      status: "published",
      snapshot: published,
      authorId: item.authorId,
      reviewerId: item.reviewerId,
    });
    await tx.insert(auditEvents).values({
      actorUserId: actorId,
      action: "content.lesson_published",
      targetType: "content",
      targetId: item.id,
      context: { version },
    });
    return published;
  });
}
