import { and, eq, gt, isNull, sql } from "drizzle-orm";

import { getDatabase } from "../client";
import {
  auditEvents,
  consents,
  privacyRequests,
  profiles,
  sessions,
  users,
} from "../schema";

export type ActiveUser = {
  id: string;
  email: string;
  displayName: string;
  passwordHash: string;
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

  await db.insert(privacyRequests).values({
    userId,
    type: "export",
    status: "completed",
    completedAt: new Date(),
  });

  return {
    account,
    consents: consentHistory,
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
