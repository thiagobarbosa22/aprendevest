import {
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import type { SimulationResult } from "@aprendevest/domain";
import { users } from "./identity";

export const simulationMode = pgEnum("simulation_mode", [
  "custom",
  "quick",
  "adaptive",
  "final_review",
]);
export const simulationStatus = pgEnum("simulation_status", [
  "in_progress",
  "submitted",
  "expired",
]);

export const simulationRuns = pgTable(
  "simulation_runs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    mode: simulationMode("mode").notNull(),
    status: simulationStatus("status").default("in_progress").notNull(),
    questionIds: jsonb("question_ids").$type<string[]>().notNull(),
    questionVersions: jsonb("question_versions")
      .$type<Record<string, number>>()
      .notNull(),
    answers: jsonb("answers")
      .$type<Record<string, string>>()
      .default({})
      .notNull(),
    elapsedSeconds: integer("elapsed_seconds").default(0).notNull(),
    durationMinutes: integer("duration_minutes").notNull(),
    result: jsonb("result").$type<SimulationResult>(),
    startedAt: timestamp("started_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    submittedAt: timestamp("submitted_at", { withTimezone: true }),
  },
  (table) => [
    index("simulation_runs_user_status_idx").on(table.userId, table.status),
  ],
);
