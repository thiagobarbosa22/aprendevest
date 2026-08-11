import type { ExamDraftInput, SubjectDraftInput } from "@aprendevest/contracts";
import {
  assertPublishableMetadata,
  canTransitionEditorialStatus,
  type EditorialStatus,
} from "@aprendevest/domain";
import { and, asc, eq } from "drizzle-orm";

import { getDatabase, isDatabaseConfigured } from "../client";
import { auditEvents, editorialRevisions, exams, subjects } from "../schema";
import { demoExams, demoSubjects } from "./demo";

export async function listPublishedExams() {
  if (!isDatabaseConfigured()) return demoExams;
  return getDatabase()
    .select({
      id: exams.id,
      slug: exams.slug,
      name: exams.name,
      acronym: exams.acronym,
      institution: exams.institution,
      board: exams.board,
      region: exams.region,
      officialUrl: exams.officialUrl,
      sourceUrl: exams.sourceUrl,
      summary: exams.summary,
      rightsStatus: exams.rightsStatus,
      version: exams.version,
      verifiedAt: exams.verifiedAt,
    })
    .from(exams)
    .where(eq(exams.status, "published"))
    .orderBy(asc(exams.acronym));
}

export async function getPublishedExam(slug: string) {
  const items = await listPublishedExams();
  return items.find((exam) => exam.slug === slug) ?? null;
}

export async function listPublishedSubjects() {
  if (!isDatabaseConfigured()) return demoSubjects;
  return getDatabase()
    .select({
      id: subjects.id,
      slug: subjects.slug,
      name: subjects.name,
      area: subjects.area,
      summary: subjects.summary,
    })
    .from(subjects)
    .where(eq(subjects.status, "published"))
    .orderBy(asc(subjects.position), asc(subjects.name));
}

export async function getPublishedSubject(slug: string) {
  const items = await listPublishedSubjects();
  return items.find((subject) => subject.slug === slug) ?? null;
}

export async function createExamDraft(input: ExamDraftInput, actorId: string) {
  const db = getDatabase();
  return db.transaction(async (tx) => {
    const [exam] = await tx
      .insert(exams)
      .values({ ...input, authorId: actorId, verifiedAt: new Date() })
      .returning();
    if (!exam) throw new Error("Falha ao criar vestibular.");
    await tx.insert(editorialRevisions).values({
      entityType: "exam",
      entityId: exam.id,
      version: exam.version,
      status: "draft",
      snapshot: exam,
      authorId: actorId,
    });
    await tx.insert(auditEvents).values({
      actorUserId: actorId,
      action: "catalog.exam_created",
      targetType: "exam",
      targetId: exam.id,
    });
    return exam;
  });
}

export async function listEditorialExams() {
  return getDatabase().select().from(exams).orderBy(asc(exams.name));
}

export async function publishExam(examId: string, reviewerId: string) {
  const db = getDatabase();
  return db.transaction(async (tx) => {
    const [exam] = await tx
      .select()
      .from(exams)
      .where(eq(exams.id, examId))
      .limit(1);
    if (!exam) throw new Error("Vestibular não encontrado.");
    if (!canTransitionEditorialStatus(exam.status, "published")) {
      throw new Error("O item precisa estar aprovado antes da publicação.");
    }
    assertPublishableMetadata({
      sourceUrl: exam.sourceUrl,
      rightsStatus:
        exam.rightsStatus === "under_review" ? null : exam.rightsStatus,
      authorId: exam.authorId,
      reviewerId,
    });
    const nextVersion = exam.version + 1;
    const [published] = await tx
      .update(exams)
      .set({
        status: "published",
        reviewerId,
        publishedAt: new Date(),
        updatedAt: new Date(),
        version: nextVersion,
      })
      .where(and(eq(exams.id, examId), eq(exams.version, exam.version)))
      .returning();
    if (!published)
      throw new Error("O item foi alterado por outra pessoa. Recarregue.");
    await tx.insert(editorialRevisions).values({
      entityType: "exam",
      entityId: exam.id,
      version: nextVersion,
      status: "published",
      snapshot: published,
      authorId: exam.authorId,
      reviewerId,
    });
    await tx.insert(auditEvents).values({
      actorUserId: reviewerId,
      action: "catalog.exam_published",
      targetType: "exam",
      targetId: exam.id,
      context: { version: nextVersion },
    });
    return published;
  });
}

export async function transitionExamStatus(
  examId: string,
  to: Extract<EditorialStatus, "in_review" | "approved">,
  actorId: string,
) {
  const db = getDatabase();
  return db.transaction(async (tx) => {
    const [exam] = await tx
      .select()
      .from(exams)
      .where(eq(exams.id, examId))
      .limit(1);
    if (!exam) throw new Error("Vestibular não encontrado.");
    if (!canTransitionEditorialStatus(exam.status, to)) {
      throw new Error(`Transição editorial inválida: ${exam.status} → ${to}.`);
    }

    const nextVersion = exam.version + 1;
    const [updated] = await tx
      .update(exams)
      .set({
        status: to,
        reviewerId: to === "approved" ? actorId : exam.reviewerId,
        version: nextVersion,
        updatedAt: new Date(),
      })
      .where(and(eq(exams.id, examId), eq(exams.version, exam.version)))
      .returning();
    if (!updated) {
      throw new Error("O item foi alterado por outra pessoa. Recarregue.");
    }
    await tx.insert(editorialRevisions).values({
      entityType: "exam",
      entityId: exam.id,
      version: nextVersion,
      status: to,
      snapshot: updated,
      authorId: exam.authorId,
      reviewerId: to === "approved" ? actorId : exam.reviewerId,
    });
    await tx.insert(auditEvents).values({
      actorUserId: actorId,
      action: `catalog.exam_${to}`,
      targetType: "exam",
      targetId: exam.id,
      context: { version: nextVersion },
    });
    return updated;
  });
}

export async function createSubjectDraft(
  input: SubjectDraftInput,
  actorId: string,
) {
  const [subject] = await getDatabase()
    .insert(subjects)
    .values({
      ...input,
      authorId: actorId,
      rightsStatus: "under_review",
    })
    .returning();
  return subject;
}
