import type { EssayDraftInput } from "@aprendevest/contracts";
import { validateEssayDraft } from "@aprendevest/domain";
import { and, desc, eq, isNull } from "drizzle-orm";
import { createHash } from "node:crypto";
import { getDatabase, isDatabaseConfigured } from "../client";
import {
  essayCorrections,
  essaySubmissions,
  essayThemes,
  featureFlags,
} from "../schema";

export type FeatureKey = "essays" | "ai_tutor" | "teachers" | "billing";
const defaults: Record<FeatureKey, boolean> = {
  essays: true,
  ai_tutor: false,
  teachers: false,
  billing: false,
};

export async function isFeatureEnabled(key: FeatureKey, userId?: string) {
  const envKey = `FEATURE_${key.toUpperCase()}`;
  if (process.env[envKey] === "true") return true;
  if (process.env[envKey] === "false") return false;
  if (!isDatabaseConfigured()) return defaults[key];
  const [flag] = await getDatabase()
    .select()
    .from(featureFlags)
    .where(eq(featureFlags.key, key))
    .limit(1);
  if (!flag?.enabled) return false;
  if (flag.rolloutPercent >= 100 || !userId) return true;
  const bucket =
    parseInt(
      createHash("sha256").update(`${key}:${userId}`).digest("hex").slice(0, 8),
      16,
    ) % 100;
  return bucket < flag.rolloutPercent;
}

export async function listFeatureStatuses() {
  const keys = Object.keys(defaults) as FeatureKey[];
  return Promise.all(
    keys.map(async (key) => ({ key, enabled: await isFeatureEnabled(key) })),
  );
}

export const demoEssayTheme = {
  id: "564da4d8-d420-4482-ae33-d1c06f52edaf",
  slug: "tecnologia-e-participacao-cidada",
  title: "Tecnologia e participação cidadã no Brasil",
  prompt:
    "Produza um texto dissertativo-argumentativo sobre como a tecnologia pode ampliar a participação cidadã sem aprofundar desigualdades.",
  supportingTexts: [],
  examLabel: "Tema autoral demonstrativo",
  sourceUrl: "https://aprendevest.com/metodologia",
  rightsStatus: "platform_authored" as const,
  version: 1,
  verifiedAt: new Date("2026-08-11T00:00:00Z"),
};

export async function listPublishedEssayThemes() {
  if (!isDatabaseConfigured()) return [demoEssayTheme];
  return getDatabase()
    .select({
      id: essayThemes.id,
      slug: essayThemes.slug,
      title: essayThemes.title,
      prompt: essayThemes.prompt,
      supportingTexts: essayThemes.supportingTexts,
      examLabel: essayThemes.examLabel,
      sourceUrl: essayThemes.sourceUrl,
      rightsStatus: essayThemes.rightsStatus,
      version: essayThemes.version,
      verifiedAt: essayThemes.verifiedAt,
    })
    .from(essayThemes)
    .where(eq(essayThemes.status, "published"))
    .orderBy(desc(essayThemes.publishedAt));
}

export async function saveEssaySubmission(
  userId: string,
  input: EssayDraftInput,
) {
  const validation = validateEssayDraft(input.text);
  if (input.submitForReview && !validation.valid)
    throw new Error(validation.message);
  const db = getDatabase();
  const [theme] = await db
    .select({ id: essayThemes.id, version: essayThemes.version })
    .from(essayThemes)
    .where(
      and(
        eq(essayThemes.id, input.themeId),
        eq(essayThemes.status, "published"),
      ),
    )
    .limit(1);
  if (!theme) throw new Error("Tema não encontrado.");
  const retentionUntil = new Date();
  retentionUntil.setUTCFullYear(retentionUntil.getUTCFullYear() + 2);
  const [submission] = await db
    .insert(essaySubmissions)
    .values({
      userId,
      themeId: theme.id,
      themeVersion: theme.version,
      title: input.title,
      text: input.text,
      wordCount: validation.words,
      status: input.submitForReview ? "submitted" : "draft",
      submittedAt: input.submitForReview ? new Date() : null,
      retentionUntil,
    })
    .returning();
  return submission;
}

export async function listUserEssays(userId: string) {
  return getDatabase()
    .select({
      id: essaySubmissions.id,
      title: essaySubmissions.title,
      text: essaySubmissions.text,
      wordCount: essaySubmissions.wordCount,
      status: essaySubmissions.status,
      createdAt: essaySubmissions.createdAt,
      themeTitle: essayThemes.title,
      corrections: essayCorrections.rubric,
      totalScore: essayCorrections.totalScore,
      generalComment: essayCorrections.generalComment,
    })
    .from(essaySubmissions)
    .innerJoin(essayThemes, eq(essaySubmissions.themeId, essayThemes.id))
    .leftJoin(
      essayCorrections,
      eq(essaySubmissions.id, essayCorrections.submissionId),
    )
    .where(
      and(
        eq(essaySubmissions.userId, userId),
        isNull(essaySubmissions.deletedAt),
      ),
    )
    .orderBy(desc(essaySubmissions.createdAt));
}

export async function deleteUserEssay(userId: string, submissionId: string) {
  await getDatabase()
    .update(essaySubmissions)
    .set({
      title: "Redação excluída",
      text: "",
      wordCount: 0,
      deletedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(essaySubmissions.id, submissionId),
        eq(essaySubmissions.userId, userId),
      ),
    );
}
