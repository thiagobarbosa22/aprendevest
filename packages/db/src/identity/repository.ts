import { and, eq, gt, isNull, sql } from "drizzle-orm";

import { getDatabase } from "../client";
import {
  auditEvents,
  attempts,
  consents,
  contentProgress,
  errorNotebook,
  essayCorrections,
  essaySubmissions,
  examRuns,
  mastery,
  oauthAccounts,
  privacyRequests,
  profiles,
  reviewItems,
  sessions,
  simulationRuns,
  studyPlans,
  studyTasks,
  users,
} from "../schema";

export type ActiveUser = {
  id: string;
  email: string;
  displayName: string;
  passwordHash: string | null;
  role: (typeof users.$inferSelect)["role"];
  status: (typeof users.$inferSelect)["status"];
};

export async function createStudent(input: {
  email: string;
  displayName: string;
  passwordHash: string;
  policyVersion: string;
}) {
  const db = getDatabase();
  return db.transaction(async (tx) => {
    const [user] = await tx
      .insert(users)
      .values({
        email: input.email,
        displayName: input.displayName,
        passwordHash: input.passwordHash,
      })
      .returning({ id: users.id, role: users.role });

    if (!user) throw new Error("Falha ao criar usuário.");

    await tx.insert(profiles).values({ userId: user.id });
    await tx.insert(consents).values({
      userId: user.id,
      purpose: "privacy_policy",
      policyVersion: input.policyVersion,
      granted: true,
    });
    await tx.insert(auditEvents).values({
      actorUserId: user.id,
      action: "identity.user_created",
      targetType: "user",
      targetId: user.id,
    });

    return user;
  });
}

export async function findOrCreateOAuthUser(input: {
  provider: "google";
  providerAccountId: string;
  email: string;
  displayName: string;
  emailVerified: boolean;
  policyVersion: string;
}): Promise<{
  user: { id: string; role: (typeof users.$inferSelect)["role"] };
  isNew: boolean;
}> {
  const db = getDatabase();
  return db.transaction(async (tx) => {
    const [linked] = await tx
      .select({ userId: oauthAccounts.userId })
      .from(oauthAccounts)
      .where(
        and(
          eq(oauthAccounts.provider, input.provider),
          eq(oauthAccounts.providerAccountId, input.providerAccountId),
        ),
      )
      .limit(1);
    if (linked) {
      const [user] = await tx
        .select({ id: users.id, role: users.role })
        .from(users)
        .where(
          and(
            eq(users.id, linked.userId),
            eq(users.status, "active"),
            isNull(users.deletedAt),
          ),
        )
        .limit(1);
      if (user) return { user, isNew: false };
    }

    // No link yet: only auto-attach to an existing account when Google has
    // verified the email, otherwise an attacker could claim someone else's
    // account by registering an unverified address that matches it.
    if (input.emailVerified) {
      const [existing] = await tx
        .select({ id: users.id, role: users.role })
        .from(users)
        .where(
          and(
            sql`lower(${users.email}) = ${input.email.toLowerCase()}`,
            eq(users.status, "active"),
            isNull(users.deletedAt),
          ),
        )
        .limit(1);
      if (existing) {
        await tx
          .insert(oauthAccounts)
          .values({
            userId: existing.id,
            provider: input.provider,
            providerAccountId: input.providerAccountId,
            email: input.email,
          })
          .onConflictDoNothing();
        return { user: existing, isNew: false };
      }
    }

    const [user] = await tx
      .insert(users)
      .values({
        email: input.email,
        displayName: input.displayName,
        passwordHash: null,
        emailVerifiedAt: input.emailVerified ? new Date() : null,
      })
      .returning({ id: users.id, role: users.role });
    if (!user) throw new Error("Falha ao criar usuário via Google.");

    await tx.insert(profiles).values({ userId: user.id });
    await tx.insert(consents).values({
      userId: user.id,
      purpose: "privacy_policy",
      policyVersion: input.policyVersion,
      granted: true,
    });
    await tx.insert(oauthAccounts).values({
      userId: user.id,
      provider: input.provider,
      providerAccountId: input.providerAccountId,
      email: input.email,
    });
    await tx.insert(auditEvents).values({
      actorUserId: user.id,
      action: "identity.user_created_oauth",
      targetType: "user",
      targetId: user.id,
    });

    return { user, isNew: true };
  });
}

export async function findActiveUserByEmail(
  email: string,
): Promise<ActiveUser | null> {
  const db = getDatabase();
  const [user] = await db
    .select({
      id: users.id,
      email: users.email,
      displayName: users.displayName,
      passwordHash: users.passwordHash,
      role: users.role,
      status: users.status,
    })
    .from(users)
    .where(
      and(
        sql`lower(${users.email}) = ${email.toLowerCase()}`,
        eq(users.status, "active"),
        isNull(users.deletedAt),
      ),
    )
    .limit(1);

  return user ?? null;
}

export async function createDatabaseSession(input: {
  tokenHash: string;
  userId: string;
  expiresAt: Date;
  userAgentHash?: string;
}) {
  await getDatabase().insert(sessions).values(input);
}

export async function findSession(tokenHash: string) {
  const db = getDatabase();
  const [session] = await db
    .select({
      tokenHash: sessions.tokenHash,
      expiresAt: sessions.expiresAt,
      userId: users.id,
      displayName: users.displayName,
      email: users.email,
      role: users.role,
      status: users.status,
      onboardingCompletedAt: profiles.onboardingCompletedAt,
    })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .innerJoin(profiles, eq(users.id, profiles.userId))
    .where(
      and(
        eq(sessions.tokenHash, tokenHash),
        gt(sessions.expiresAt, new Date()),
        eq(users.status, "active"),
        isNull(users.deletedAt),
      ),
    )
    .limit(1);

  return session ?? null;
}

export async function deleteDatabaseSession(tokenHash: string) {
  await getDatabase().delete(sessions).where(eq(sessions.tokenHash, tokenHash));
}

export async function deleteAllUserSessions(userId: string) {
  await getDatabase().delete(sessions).where(eq(sessions.userId, userId));
}

export async function completeProfile(
  userId: string,
  input: {
    targetCourse: string;
    targetExams: string[];
    weeklyMinutes: number;
    currentLevel: string;
    ageGroup: "minor" | "adult" | "undisclosed";
  },
) {
  await getDatabase()
    .update(profiles)
    .set({
      ...input,
      weeklyMinutes: input.weeklyMinutes,
      onboardingCompletedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(profiles.userId, userId));
}

export async function getUserPrivacyExport(userId: string) {
  const db = getDatabase();
  const [account] = await db
    .select({
      id: users.id,
      email: users.email,
      displayName: users.displayName,
      role: users.role,
      status: users.status,
      createdAt: users.createdAt,
      targetCourse: profiles.targetCourse,
      targetExams: profiles.targetExams,
      weeklyMinutes: profiles.weeklyMinutes,
      currentLevel: profiles.currentLevel,
      ageGroup: profiles.ageGroup,
      preferences: profiles.preferences,
      accessibility: profiles.accessibility,
    })
    .from(users)
    .innerJoin(profiles, eq(users.id, profiles.userId))
    .where(eq(users.id, userId))
    .limit(1);
  const consentHistory = await db
    .select({
      purpose: consents.purpose,
      policyVersion: consents.policyVersion,
      granted: consents.granted,
      occurredAt: consents.occurredAt,
    })
    .from(consents)
    .where(eq(consents.userId, userId));
  const [
    attemptHistory,
    lessonProgress,
    errors,
    exams,
    simulations,
    plans,
    tasks,
    masteryHistory,
    reviews,
    essays,
  ] = await Promise.all([
    db.select().from(attempts).where(eq(attempts.userId, userId)),
    db.select().from(contentProgress).where(eq(contentProgress.userId, userId)),
    db.select().from(errorNotebook).where(eq(errorNotebook.userId, userId)),
    db.select().from(examRuns).where(eq(examRuns.userId, userId)),
    db.select().from(simulationRuns).where(eq(simulationRuns.userId, userId)),
    db.select().from(studyPlans).where(eq(studyPlans.userId, userId)),
    db
      .select({ task: studyTasks })
      .from(studyTasks)
      .innerJoin(studyPlans, eq(studyTasks.planId, studyPlans.id))
      .where(eq(studyPlans.userId, userId)),
    db.select().from(mastery).where(eq(mastery.userId, userId)),
    db.select().from(reviewItems).where(eq(reviewItems.userId, userId)),
    db
      .select({ submission: essaySubmissions, correction: essayCorrections })
      .from(essaySubmissions)
      .leftJoin(
        essayCorrections,
        eq(essaySubmissions.id, essayCorrections.submissionId),
      )
      .where(eq(essaySubmissions.userId, userId)),
  ]);

  await db.insert(privacyRequests).values({
    userId,
    type: "export",
    status: "completed",
    completedAt: new Date(),
  });

  return {
    account,
    consents: consentHistory,
    learning: {
      attempts: attemptHistory,
      contentProgress: lessonProgress,
      errorNotebook: errors,
      examRuns: exams,
      simulationRuns: simulations,
      studyPlans: plans,
      studyTasks: tasks.map((item) => item.task),
      mastery: masteryHistory,
      reviews,
      essays,
    },
    exportedAt: new Date().toISOString(),
  };
}

export async function requestUserDeletion(userId: string) {
  const db = getDatabase();
  await db.transaction(async (tx) => {
    await tx.insert(privacyRequests).values({ userId, type: "deletion" });
    await tx
      .update(users)
      .set({ status: "pending_deletion", updatedAt: new Date() })
      .where(eq(users.id, userId));
    await tx.delete(sessions).where(eq(sessions.userId, userId));
    await tx.insert(auditEvents).values({
      actorUserId: userId,
      action: "privacy.deletion_requested",
      targetType: "user",
      targetId: userId,
    });
  });
}
