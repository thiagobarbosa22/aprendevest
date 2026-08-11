import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { editorialStatus, rightsStatus } from "./catalog";
import { users } from "./identity";

export const featureFlags = pgTable("feature_flags", {
  key: varchar("key", { length: 80 }).primaryKey(),
  description: text("description").notNull(),
  enabled: boolean("enabled").default(false).notNull(),
  rolloutPercent: integer("rollout_percent").default(0).notNull(),
  updatedBy: uuid("updated_by").references(() => users.id, {
    onDelete: "set null",
  }),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const essaySubmissionStatus = pgEnum("essay_submission_status", [
  "draft",
  "submitted",
  "in_review",
  "reviewed",
]);

export const essayThemes = pgTable(
  "essay_themes",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    slug: varchar("slug", { length: 140 }).notNull().unique(),
    title: varchar("title", { length: 200 }).notNull(),
    prompt: text("prompt").notNull(),
    supportingTexts: jsonb("supporting_texts")
      .$type<Array<{ title: string; excerpt: string; sourceUrl: string }>>()
      .default([])
      .notNull(),
    examLabel: varchar("exam_label", { length: 80 }).notNull(),
    sourceUrl: text("source_url").notNull(),
    rightsStatus: rightsStatus("rights_status").notNull(),
    status: editorialStatus("status").default("draft").notNull(),
    version: integer("version").default(1).notNull(),
    authorId: uuid("author_id").references(() => users.id, {
      onDelete: "set null",
    }),
    reviewerId: uuid("reviewer_id").references(() => users.id, {
      onDelete: "set null",
    }),
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
    index("essay_themes_status_idx").on(table.status, table.publishedAt),
  ],
);

export const essaySubmissions = pgTable(
  "essay_submissions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    themeId: uuid("theme_id")
      .notNull()
      .references(() => essayThemes.id, { onDelete: "restrict" }),
    themeVersion: integer("theme_version").notNull(),
    title: varchar("title", { length: 160 }).notNull(),
    text: text("text").notNull(),
    wordCount: integer("word_count").notNull(),
    status: essaySubmissionStatus("status").default("draft").notNull(),
    aiAssistanceUsed: boolean("ai_assistance_used").default(false).notNull(),
    retentionUntil: timestamp("retention_until", {
      withTimezone: true,
    }).notNull(),
    submittedAt: timestamp("submitted_at", { withTimezone: true }),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("essay_submissions_user_status_idx").on(table.userId, table.status),
  ],
);

export const essayCorrections = pgTable(
  "essay_corrections",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    submissionId: uuid("submission_id")
      .notNull()
      .references(() => essaySubmissions.id, { onDelete: "cascade" }),
    reviewerId: uuid("reviewer_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    rubric: jsonb("rubric")
      .$type<
        Array<{
          criterion: string;
          score: number;
          maxScore: number;
          comment: string;
        }>
      >()
      .notNull(),
    totalScore: integer("total_score").notNull(),
    generalComment: text("general_comment").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [index("essay_corrections_submission_idx").on(table.submissionId)],
);
