import {
  type AnyPgColumn,
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

import { users } from "./identity";

export const editorialStatus = pgEnum("editorial_status", [
  "draft",
  "in_review",
  "approved",
  "published",
  "archived",
  "blocked",
]);

export const rightsStatus = pgEnum("rights_status", [
  "official_link",
  "authorized",
  "platform_authored",
  "under_review",
  "blocked",
]);

export const subjectArea = pgEnum("subject_area", [
  "languages",
  "mathematics",
  "natural_sciences",
  "human_sciences",
  "interdisciplinary",
]);

const editorialColumns = {
  status: editorialStatus("status").default("draft").notNull(),
  version: integer("version").default(1).notNull(),
  authorId: uuid("author_id").references(() => users.id, {
    onDelete: "set null",
  }),
  reviewerId: uuid("reviewer_id").references(() => users.id, {
    onDelete: "set null",
  }),
  sourceUrl: text("source_url"),
  rightsStatus: rightsStatus("rights_status").default("under_review").notNull(),
  verifiedAt: timestamp("verified_at", { withTimezone: true }),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
};

export const exams = pgTable(
  "exams",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    slug: varchar("slug", { length: 100 }).notNull(),
    name: varchar("name", { length: 160 }).notNull(),
    acronym: varchar("acronym", { length: 24 }).notNull(),
    institution: varchar("institution", { length: 160 }).notNull(),
    board: varchar("board", { length: 120 }).notNull(),
    region: varchar("region", { length: 80 }).notNull(),
    officialUrl: text("official_url").notNull(),
    summary: text("summary").notNull(),
    ...editorialColumns,
  },
  (table) => [
    uniqueIndex("exams_slug_unique").on(table.slug),
    index("exams_status_idx").on(table.status),
    index("exams_institution_idx").on(table.institution),
  ],
);

export const examEditions = pgTable(
  "exam_editions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    examId: uuid("exam_id")
      .notNull()
      .references(() => exams.id, { onDelete: "cascade" }),
    year: integer("year").notNull(),
    editionLabel: varchar("edition_label", { length: 80 }),
    format: jsonb("format")
      .$type<Record<string, unknown>>()
      .default({})
      .notNull(),
    calendar: jsonb("calendar")
      .$type<Record<string, string>>()
      .default({})
      .notNull(),
    rulesSourceUrl: text("rules_source_url").notNull(),
    verifiedAt: timestamp("verified_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("exam_editions_exam_year_unique").on(table.examId, table.year),
  ],
);

export const subjects = pgTable(
  "subjects",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    slug: varchar("slug", { length: 100 }).notNull(),
    name: varchar("name", { length: 100 }).notNull(),
    area: subjectArea("area").notNull(),
    summary: text("summary").notNull(),
    position: integer("position").default(0).notNull(),
    ...editorialColumns,
  },
  (table) => [
    uniqueIndex("subjects_slug_unique").on(table.slug),
    index("subjects_area_status_idx").on(table.area, table.status),
  ],
);

export const topics = pgTable(
  "topics",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    subjectId: uuid("subject_id")
      .notNull()
      .references(() => subjects.id, { onDelete: "cascade" }),
    parentId: uuid("parent_id").references((): AnyPgColumn => topics.id, {
      onDelete: "set null",
    }),
    slug: varchar("slug", { length: 120 }).notNull(),
    name: varchar("name", { length: 140 }).notNull(),
    summary: text("summary").notNull(),
    position: integer("position").default(0).notNull(),
    difficulty: integer("difficulty").default(1).notNull(),
    estimatedMinutes: integer("estimated_minutes").default(30).notNull(),
    status: editorialStatus("status").default("draft").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("topics_subject_slug_unique").on(table.subjectId, table.slug),
    index("topics_parent_idx").on(table.parentId),
  ],
);

export const topicPrerequisites = pgTable(
  "topic_prerequisites",
  {
    topicId: uuid("topic_id")
      .notNull()
      .references(() => topics.id, { onDelete: "cascade" }),
    prerequisiteTopicId: uuid("prerequisite_topic_id")
      .notNull()
      .references(() => topics.id, { onDelete: "cascade" }),
  },
  (table) => [
    primaryKey({ columns: [table.topicId, table.prerequisiteTopicId] }),
  ],
);

export const skills = pgTable(
  "skills",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    code: varchar("code", { length: 40 }).notNull(),
    name: varchar("name", { length: 180 }).notNull(),
    description: text("description").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [uniqueIndex("skills_code_unique").on(table.code)],
);

export const topicSkills = pgTable(
  "topic_skills",
  {
    topicId: uuid("topic_id")
      .notNull()
      .references(() => topics.id, { onDelete: "cascade" }),
    skillId: uuid("skill_id")
      .notNull()
      .references(() => skills.id, { onDelete: "cascade" }),
  },
  (table) => [primaryKey({ columns: [table.topicId, table.skillId] })],
);

export const editorialRevisions = pgTable(
  "editorial_revisions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    entityType: varchar("entity_type", { length: 80 }).notNull(),
    entityId: uuid("entity_id").notNull(),
    version: integer("version").notNull(),
    status: editorialStatus("status").notNull(),
    snapshot: jsonb("snapshot").$type<Record<string, unknown>>().notNull(),
    authorId: uuid("author_id").references(() => users.id, {
      onDelete: "set null",
    }),
    reviewerId: uuid("reviewer_id").references(() => users.id, {
      onDelete: "set null",
    }),
    decisionNote: text("decision_note"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("editorial_revision_entity_idx").on(
      table.entityType,
      table.entityId,
      table.version,
    ),
  ],
);
