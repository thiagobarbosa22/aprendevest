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
  boolean,
} from "drizzle-orm/pg-core";
import { editorialStatus, exams, rightsStatus, topics } from "./catalog";
import { users } from "./identity";

export const questionType = pgEnum("question_type", [
  "multiple_choice",
  "free_response",
]);
export const attemptContext = pgEnum("attempt_context", [
  "practice",
  "exam",
  "simulation",
  "review",
]);
export const errorClassification = pgEnum("error_classification", [
  "content",
  "interpretation",
  "calculation",
  "distraction",
  "time",
]);

export const questions = pgTable(
  "questions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    examId: uuid("exam_id").references(() => exams.id, {
      onDelete: "set null",
    }),
    topicId: uuid("topic_id")
      .notNull()
      .references(() => topics.id, { onDelete: "restrict" }),
    year: integer("year"),
    number: integer("number"),
    type: questionType("type").default("multiple_choice").notNull(),
    prompt: text("prompt").notNull(),
    options: jsonb("options")
      .$type<Array<{ id: string; text: string }>>()
      .default([])
      .notNull(),
    correctAnswer: text("correct_answer").notNull(),
    resolution: text("resolution").notNull(),
    commonError: text("common_error"),
    difficulty: integer("difficulty").default(1).notNull(),
    sourceUrl: text("source_url").notNull(),
    checksum: varchar("checksum", { length: 64 }).notNull(),
    accessedAt: timestamp("accessed_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    rightsStatus: rightsStatus("rights_status").notNull(),
    status: editorialStatus("status").default("draft").notNull(),
    version: integer("version").default(1).notNull(),
    authorId: uuid("author_id").references(() => users.id, {
      onDelete: "set null",
    }),
    reviewerId: uuid("reviewer_id").references(() => users.id, {
      onDelete: "set null",
    }),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("questions_checksum_unique").on(table.checksum),
    index("questions_topic_status_idx").on(table.topicId, table.status),
    index("questions_exam_year_idx").on(table.examId, table.year),
  ],
);

export const attempts = pgTable(
  "attempts",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    questionId: uuid("question_id")
      .notNull()
      .references(() => questions.id, { onDelete: "restrict" }),
    answer: text("answer").notNull(),
    correct: boolean("correct").notNull(),
    durationSeconds: integer("duration_seconds").notNull(),
    context: attemptContext("context").notNull(),
    idempotencyKey: uuid("idempotency_key").notNull(),
    questionVersion: integer("question_version").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("attempts_user_idempotency_unique").on(
      table.userId,
      table.idempotencyKey,
    ),
    index("attempts_user_question_idx").on(
      table.userId,
      table.questionId,
      table.createdAt,
    ),
  ],
);

export const errorNotebook = pgTable(
  "error_notebook",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    questionId: uuid("question_id")
      .notNull()
      .references(() => questions.id, { onDelete: "cascade" }),
    lastAttemptId: uuid("last_attempt_id")
      .notNull()
      .references(() => attempts.id, { onDelete: "cascade" }),
    classification: errorClassification("classification"),
    resolvedAt: timestamp("resolved_at", { withTimezone: true }),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.questionId] })],
);
