import type { ContentBlock } from "@aprendevest/contracts";
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

import { editorialStatus, rightsStatus, subjects, topics } from "./catalog";
import { users } from "./identity";

export const contentType = pgEnum("content_type", [
  "lesson",
  "video",
  "summary",
  "mind_map",
  "flashcards",
  "audio",
  "formula_sheet",
]);

export const progressStatus = pgEnum("progress_status", [
  "not_started",
  "in_progress",
  "completed",
]);

export const curriculumModules = pgTable(
  "curriculum_modules",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    subjectId: uuid("subject_id")
      .notNull()
      .references(() => subjects.id, { onDelete: "cascade" }),
    slug: varchar("slug", { length: 120 }).notNull(),
    title: varchar("title", { length: 180 }).notNull(),
    summary: text("summary").notNull(),
    objectives: jsonb("objectives").$type<string[]>().default([]).notNull(),
    position: integer("position").default(0).notNull(),
    status: editorialStatus("status").default("draft").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("curriculum_modules_subject_slug_unique").on(
      table.subjectId,
      table.slug,
    ),
  ],
);

export const contentItems = pgTable(
  "content_items",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    moduleId: uuid("module_id")
      .notNull()
      .references(() => curriculumModules.id, { onDelete: "cascade" }),
    topicId: uuid("topic_id")
      .notNull()
      .references(() => topics.id, { onDelete: "restrict" }),
    slug: varchar("slug", { length: 120 }).notNull(),
    type: contentType("type").default("lesson").notNull(),
    title: varchar("title", { length: 180 }).notNull(),
    summary: text("summary").notNull(),
    body: jsonb("body").$type<ContentBlock[]>().default([]).notNull(),
    objectives: jsonb("objectives").$type<string[]>().default([]).notNull(),
    estimatedMinutes: integer("estimated_minutes").notNull(),
    mediaUrl: text("media_url"),
    transcript: text("transcript"),
    chapters: jsonb("chapters")
      .$type<Array<{ title: string; startSeconds: number }>>()
      .default([])
      .notNull(),
    accessibleText: text("accessible_text").notNull(),
    status: editorialStatus("status").default("draft").notNull(),
    version: integer("version").default(1).notNull(),
    authorId: uuid("author_id").references(() => users.id, {
      onDelete: "set null",
    }),
    reviewerId: uuid("reviewer_id").references(() => users.id, {
      onDelete: "set null",
    }),
    sourceUrl: text("source_url").notNull(),
    rightsStatus: rightsStatus("rights_status")
      .default("under_review")
      .notNull(),
    checksum: varchar("checksum", { length: 64 }),
    verifiedAt: timestamp("verified_at", { withTimezone: true }),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("content_items_slug_unique").on(table.slug),
    index("content_items_topic_status_idx").on(table.topicId, table.status),
    index("content_items_module_position_idx").on(
      table.moduleId,
      table.createdAt,
    ),
  ],
);

export const contentProgress = pgTable(
  "content_progress",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    contentId: uuid("content_id")
      .notNull()
      .references(() => contentItems.id, { onDelete: "cascade" }),
    status: progressStatus("status").default("not_started").notNull(),
    percent: integer("percent").default(0).notNull(),
    positionSeconds: integer("position_seconds").default(0).notNull(),
    startedAt: timestamp("started_at", { withTimezone: true }),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.userId, table.contentId] }),
    index("content_progress_user_status_idx").on(table.userId, table.status),
  ],
);

export const contentNotes = pgTable(
  "content_notes",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    contentId: uuid("content_id")
      .notNull()
      .references(() => contentItems.id, { onDelete: "cascade" }),
    body: text("body").notNull(),
    timestampSeconds: integer("timestamp_seconds"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("content_notes_user_content_idx").on(table.userId, table.contentId),
  ],
);

export const contentBookmarks = pgTable(
  "content_bookmarks",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    contentId: uuid("content_id")
      .notNull()
      .references(() => contentItems.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.contentId] })],
);
