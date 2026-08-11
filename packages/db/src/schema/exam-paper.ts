import {
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { editorialStatus, examEditions, rightsStatus } from "./catalog";
import { questions } from "./assessment";
import { users } from "./identity";

export const examRunStatus = pgEnum("exam_run_status", [
  "in_progress",
  "submitted",
  "expired",
]);
export const examPapers = pgTable(
  "exam_papers",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    editionId: uuid("edition_id")
      .notNull()
      .references(() => examEditions.id, { onDelete: "cascade" }),
    slug: varchar("slug", { length: 140 }).notNull(),
    title: varchar("title", { length: 200 }).notNull(),
    phase: varchar("phase", { length: 80 }),
    day: integer("day"),
    durationMinutes: integer("duration_minutes").notNull(),
    officialUrl: text("official_url").notNull(),
    answerKeyUrl: text("answer_key_url"),
    checksum: varchar("checksum", { length: 64 }).notNull(),
    rightsStatus: rightsStatus("rights_status").notNull(),
    status: editorialStatus("status").default("draft").notNull(),
    version: integer("version").default(1).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("exam_papers_slug_unique").on(table.slug),
    uniqueIndex("exam_papers_checksum_unique").on(table.checksum),
  ],
);
export const examPaperQuestions = pgTable(
  "exam_paper_questions",
  {
    paperId: uuid("paper_id")
      .notNull()
      .references(() => examPapers.id, { onDelete: "cascade" }),
    questionId: uuid("question_id")
      .notNull()
      .references(() => questions.id, { onDelete: "restrict" }),
    position: integer("position").notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.paperId, table.questionId] }),
    uniqueIndex("paper_question_position_unique").on(
      table.paperId,
      table.position,
    ),
  ],
);
export const examRuns = pgTable(
  "exam_runs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    paperId: uuid("paper_id")
      .notNull()
      .references(() => examPapers.id, { onDelete: "restrict" }),
    paperVersion: integer("paper_version").notNull(),
    status: examRunStatus("status").default("in_progress").notNull(),
    answers: jsonb("answers")
      .$type<Record<string, string>>()
      .default({})
      .notNull(),
    elapsedSeconds: integer("elapsed_seconds").default(0).notNull(),
    startedAt: timestamp("started_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    submittedAt: timestamp("submitted_at", { withTimezone: true }),
  },
  (table) => [
    index("exam_runs_user_status_idx").on(table.userId, table.status),
  ],
);
