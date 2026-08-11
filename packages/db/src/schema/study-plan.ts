import {
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { topics } from "./catalog";
import { contentItems } from "./content";
import { users } from "./identity";

export const planStatus = pgEnum("study_plan_status", ["active", "archived"]);
export const taskKind = pgEnum("study_task_kind", [
  "theory",
  "practice",
  "review",
  "simulation",
]);
export const taskStatus = pgEnum("study_task_status", [
  "pending",
  "completed",
  "skipped",
]);

export const diagnostics = pgTable(
  "diagnostics",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    answers: jsonb("answers")
      .$type<Array<{ topicId: string; score: number; confidence?: number }>>()
      .notNull(),
    completedAt: timestamp("completed_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("diagnostics_user_date_idx").on(table.userId, table.completedAt),
  ],
);

export const studyPlans = pgTable(
  "study_plans",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    status: planStatus("status").default("active").notNull(),
    weeklyMinutes: integer("weekly_minutes").notNull(),
    explanation: text("explanation").notNull(),
    startsAt: timestamp("starts_at", { withTimezone: true }).notNull(),
    endsAt: timestamp("ends_at", { withTimezone: true }).notNull(),
    version: integer("version").default(1).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("study_plans_user_status_idx").on(table.userId, table.status),
  ],
);

export const studyTasks = pgTable(
  "study_tasks",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    planId: uuid("plan_id")
      .notNull()
      .references(() => studyPlans.id, { onDelete: "cascade" }),
    topicId: uuid("topic_id").references(() => topics.id, {
      onDelete: "set null",
    }),
    contentId: uuid("content_id").references(() => contentItems.id, {
      onDelete: "set null",
    }),
    title: varchar("title", { length: 180 }).notNull(),
    kind: taskKind("kind").notNull(),
    status: taskStatus("status").default("pending").notNull(),
    minutes: integer("minutes").notNull(),
    reason: text("reason").notNull(),
    scheduledFor: timestamp("scheduled_for", { withTimezone: true }).notNull(),
    completedAt: timestamp("completed_at", { withTimezone: true }),
  },
  (table) => [
    index("study_tasks_plan_date_idx").on(table.planId, table.scheduledFor),
  ],
);

export const mastery = pgTable(
  "mastery",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    topicId: uuid("topic_id")
      .notNull()
      .references(() => topics.id, { onDelete: "cascade" }),
    estimatePercent: integer("estimate_percent").notNull(),
    evidenceCount: integer("evidence_count").default(0).notNull(),
    evidence: jsonb("evidence")
      .$type<Record<string, unknown>>()
      .default({})
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("mastery_user_topic_unique").on(table.userId, table.topicId),
  ],
);

export const reviewItems = pgTable(
  "review_items",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    topicId: uuid("topic_id").references(() => topics.id, {
      onDelete: "cascade",
    }),
    sourceType: varchar("source_type", { length: 40 }).notNull(),
    sourceId: uuid("source_id").notNull(),
    intervalDays: integer("interval_days").default(1).notNull(),
    nextReviewAt: timestamp("next_review_at", { withTimezone: true }).notNull(),
    history: jsonb("history")
      .$type<Array<{ at: string; quality: number; intervalDays: number }>>()
      .default([])
      .notNull(),
  },
  (table) => [
    uniqueIndex("review_items_user_source_unique").on(
      table.userId,
      table.sourceType,
      table.sourceId,
      table.topicId,
    ),
    index("review_items_due_idx").on(table.userId, table.nextReviewAt),
  ],
);
