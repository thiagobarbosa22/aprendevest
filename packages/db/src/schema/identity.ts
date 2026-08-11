import { sql } from "drizzle-orm";
import {
  boolean,
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

export const userRole = pgEnum("user_role", [
  "student",
  "teacher",
  "author",
  "reviewer",
  "editor",
  "support",
  "admin",
]);

export const userStatus = pgEnum("user_status", [
  "active",
  "pending_deletion",
  "blocked",
]);

export const ageGroup = pgEnum("age_group", ["minor", "adult", "undisclosed"]);

export const privacyRequestType = pgEnum("privacy_request_type", [
  "export",
  "deletion",
]);

export const privacyRequestStatus = pgEnum("privacy_request_status", [
  "requested",
  "processing",
  "completed",
  "cancelled",
]);

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
};

export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    email: varchar("email", { length: 320 }).notNull(),
    displayName: varchar("display_name", { length: 100 }).notNull(),
    passwordHash: text("password_hash").notNull(),
    role: userRole("role").default("student").notNull(),
    status: userStatus("status").default("active").notNull(),
    emailVerifiedAt: timestamp("email_verified_at", { withTimezone: true }),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("users_email_active_unique")
      .on(sql`lower(${table.email})`)
      .where(sql`${table.deletedAt} is null`),
    index("users_role_idx").on(table.role),
    index("users_status_idx").on(table.status),
  ],
);

export const profiles = pgTable("profiles", {
  userId: uuid("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  targetCourse: varchar("target_course", { length: 120 }),
  targetExams: jsonb("target_exams").$type<string[]>().default([]).notNull(),
  weeklyMinutes: integer("weekly_minutes").default(300).notNull(),
  currentLevel: varchar("current_level", { length: 24 }),
  ageGroup: ageGroup("age_group").default("undisclosed").notNull(),
  preferences: jsonb("preferences")
    .$type<Record<string, unknown>>()
    .default({})
    .notNull(),
  accessibility: jsonb("accessibility")
    .$type<Record<string, unknown>>()
    .default({})
    .notNull(),
  onboardingCompletedAt: timestamp("onboarding_completed_at", {
    withTimezone: true,
  }),
  ...timestamps,
});

export const consents = pgTable(
  "consents",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    purpose: varchar("purpose", { length: 80 }).notNull(),
    policyVersion: varchar("policy_version", { length: 32 }).notNull(),
    granted: boolean("granted").notNull(),
    occurredAt: timestamp("occurred_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("consents_user_purpose_idx").on(table.userId, table.purpose),
  ],
);

export const sessions = pgTable(
  "sessions",
  {
    tokenHash: varchar("token_hash", { length: 64 }).primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    lastSeenAt: timestamp("last_seen_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    userAgentHash: varchar("user_agent_hash", { length: 64 }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("sessions_user_idx").on(table.userId),
    index("sessions_expiry_idx").on(table.expiresAt),
  ],
);

export const privacyRequests = pgTable(
  "privacy_requests",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    type: privacyRequestType("type").notNull(),
    status: privacyRequestStatus("status").default("requested").notNull(),
    requestedAt: timestamp("requested_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    completedAt: timestamp("completed_at", { withTimezone: true }),
  },
  (table) => [
    index("privacy_requests_user_idx").on(table.userId, table.status),
  ],
);

export const auditEvents = pgTable(
  "audit_events",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    actorUserId: uuid("actor_user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    action: varchar("action", { length: 100 }).notNull(),
    targetType: varchar("target_type", { length: 80 }).notNull(),
    targetId: varchar("target_id", { length: 120 }),
    context: jsonb("context")
      .$type<Record<string, unknown>>()
      .default({})
      .notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("audit_actor_idx").on(table.actorUserId),
    index("audit_target_idx").on(table.targetType, table.targetId),
    index("audit_created_idx").on(table.createdAt),
  ],
);
