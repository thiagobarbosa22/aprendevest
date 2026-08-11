import {
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { editorialStatus, exams } from "./catalog";

/**
 * Required-reading lists ("obras literárias obrigatórias") change every
 * edition and per vestibular — kept as its own table, editable
 * independently from the general subject/lesson content.
 */
export const literaryWorks = pgTable(
  "literary_works",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    examId: uuid("exam_id")
      .notNull()
      .references(() => exams.id, { onDelete: "cascade" }),
    editionYear: integer("edition_year").notNull(),
    title: varchar("title", { length: 200 }).notNull(),
    author: varchar("author", { length: 160 }).notNull(),
    genre: varchar("genre", { length: 80 }),
    sourceUrl: text("source_url").notNull(),
    notes: text("notes"),
    status: editorialStatus("status").default("draft").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("literary_works_exam_edition_idx").on(
      table.examId,
      table.editionYear,
    ),
    uniqueIndex("literary_works_exam_edition_title_unique").on(
      table.examId,
      table.editionYear,
      table.title,
    ),
  ],
);
