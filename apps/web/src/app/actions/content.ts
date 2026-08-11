"use server";

import { lessonDraftSchema } from "@aprendevest/contracts";
import {
  createLessonDraft,
  publishContent,
  transitionContentStatus,
} from "@aprendevest/db";
import { revalidatePath } from "next/cache";

import { requirePermission } from "../../lib/auth/guards";

export type ContentFormState = {
  message?: string;
  success?: boolean;
  errors?: Record<string, string[]>;
};

export async function createLesson(
  _state: ContentFormState,
  formData: FormData,
): Promise<ContentFormState> {
  const user = await requirePermission("content:create");
  const introduction = String(formData.get("introduction") ?? "");
  const parsed = lessonDraftSchema.safeParse({
    moduleId: formData.get("moduleId"),
    topicId: formData.get("topicId"),
    slug: formData.get("slug"),
    title: formData.get("title"),
    summary: formData.get("summary"),
    estimatedMinutes: Number(formData.get("estimatedMinutes")),
    objectives: String(formData.get("objectives") ?? "")
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean),
    body: [{ type: "paragraph", text: introduction }],
    accessibleText: formData.get("accessibleText"),
    sourceUrl: formData.get("sourceUrl"),
    rightsStatus: formData.get("rightsStatus"),
  });
  if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors };
  try {
    await createLessonDraft(parsed.data, user.userId);
    revalidatePath("/admin/conteudos");
    return { success: true, message: "Aula salva como rascunho." };
  } catch {
    return { message: "Não foi possível salvar a aula." };
  }
}

async function contentId(formData: FormData) {
  const value = formData.get("contentId");
  if (typeof value !== "string") throw new Error("Conteúdo inválido.");
  return value;
}

export async function submitContentAction(formData: FormData) {
  const user = await requirePermission("content:create");
  await transitionContentStatus(
    await contentId(formData),
    "in_review",
    user.userId,
  );
  revalidatePath("/admin/conteudos");
}

export async function approveContentAction(formData: FormData) {
  const user = await requirePermission("content:review");
  await transitionContentStatus(
    await contentId(formData),
    "approved",
    user.userId,
  );
  revalidatePath("/admin/conteudos");
}

export async function publishContentAction(formData: FormData) {
  const user = await requirePermission("content:publish");
  await publishContent(await contentId(formData), user.userId);
  revalidatePath("/admin/conteudos");
  revalidatePath("/materias");
}
