import {
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { users } from "./identity";

export type EnemApiAlternative = {
  letter: string;
  text: string | null;
  file: string | null;
  isCorrect: boolean;
};

export type EnemApiQuestion = {
  title: string;
  index: number;
  discipline: string;
  language: string | null;
  year: number;
  context: string | null;
  files: string[];
  correctAlternative: string;
  alternativesIntroduction: string;
  alternatives: EnemApiAlternative[];
};

/**
 * One row per ENEM edition (year), holding every question returned by the
 * public api.enem.dev for that year. Populated lazily on first request and
 * kept forever — past exams don't change — so we hit the (tightly
 * rate-limited) external API at most once per year, ever.
 */
export const enemQuestionCache = pgTable(
  "enem_question_cache",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    year: integer("year").notNull(),
    questions: jsonb("questions").$type<EnemApiQuestion[]>().notNull(),
    fetchedAt: timestamp("fetched_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [uniqueIndex("enem_question_cache_year_unique").on(table.year)],
);

export const enemSimulationStatus = pgEnum("enem_simulation_status", [
  "in_progress",
  "submitted",
]);

export type EnemSimulationQuestionSnapshot = {
  index: number;
  discipline: string;
  language: string | null;
  context: string | null;
  files: string[];
  alternativesIntroduction: string;
  alternatives: Array<{
    letter: string;
    text: string | null;
    file: string | null;
  }>;
  correctAlternative: string;
};

export type EnemSimulationResult = {
  total: number;
  answered: number;
  correct: number;
  accuracyPercent: number;
  byDiscipline: Record<string, { total: number; correct: number }>;
};

export const enemSimulationRuns = pgTable(
  "enem_simulation_runs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    year: integer("year").notNull(),
    discipline: varchar("discipline", { length: 40 }).notNull(),
    language: varchar("language", { length: 20 }),
    questions: jsonb("questions")
      .$type<EnemSimulationQuestionSnapshot[]>()
      .notNull(),
    answers: jsonb("answers")
      .$type<Record<string, string>>()
      .default({})
      .notNull(),
    elapsedSeconds: integer("elapsed_seconds").default(0).notNull(),
    status: enemSimulationStatus("status").default("in_progress").notNull(),
    result: jsonb("result").$type<EnemSimulationResult | null>(),
    startedAt: timestamp("started_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    submittedAt: timestamp("submitted_at", { withTimezone: true }),
  },
  (table) => [
    index("enem_simulation_runs_user_idx").on(table.userId, table.startedAt),
  ],
);
