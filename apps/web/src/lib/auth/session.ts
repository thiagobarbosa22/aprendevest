import { createHash, randomBytes } from "node:crypto";
import { cookies, headers } from "next/headers";

import {
  createDatabaseSession,
  deleteDatabaseSession,
  findSession,
} from "@aprendevest/db";

const sessionCookie = "aprendevest_session";
const sessionDurationMs = 7 * 24 * 60 * 60 * 1_000;

function hashToken(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

export async function createSession(userId: string): Promise<void> {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + sessionDurationMs);
  const userAgent = (await headers()).get("user-agent") ?? "";

  await createDatabaseSession({
    tokenHash: hashToken(token),
    userId,
    expiresAt,
    userAgentHash: userAgent ? hashToken(userAgent) : undefined,
  });

  (await cookies()).set(sessionCookie, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
    priority: "high",
  });
}

export async function getCurrentUser() {
  const token = (await cookies()).get(sessionCookie)?.value;
  if (!token) return null;

  return findSession(hashToken(token));
}

export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(sessionCookie)?.value;

  if (token) {
    await deleteDatabaseSession(hashToken(token));
  }

  cookieStore.delete(sessionCookie);
}
