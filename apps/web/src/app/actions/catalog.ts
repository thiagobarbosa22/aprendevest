"use server";

import { examDraftSchema } from "@aprendevest/contracts";
import {
  createExamDraft,
  publishExam,
  transitionExamStatus,
} from "@aprendevest/db";
import { revalidatePath } from "next/cache";

import { requirePermission } from "../../lib/auth/guards";

export type CatalogFormState = {
  message?: string;
  success?: boolean;
  errors?: Record<string, string[]>;
};

export async function createExam(
  _state: CatalogFormState,
  formData: FormData,
): Promise<CatalogFormState> {
  const user = await requirePermission("content:create");
  const parsed = examDraftSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors };

  try {
    await createExamDraft(parsed.data, user.userId);
    revalidatePath("/admin/catalogo");
    return { success: true, message: "Vestibular salvo como rascunho." };
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "23505"
    ) {
      return { message: "Já existe um vestibular com esse slug." };
    }
    return { message: "Não foi possível salvar o vestibular." };
  }
}

export async function publishExamAction(formData: FormData): Promise<void> {
  const user = await requirePermission("content:publish");
  const examId = formData.get("examId");
  if (typeof examId !== "string") throw new Error("Vestibular inválido.");
  await publishExam(examId, user.userId);
  revalidatePath("/admin/catalogo");
  revalidatePath("/vestibulares");
}

export async function submitExamForReviewAction(
  formData: FormData,
): Promise<void> {
  const user = await requirePermission("content:create");
  const examId = formData.get("examId");
  if (typeof examId !== "string") throw new Error("Vestibular inválido.");
  await transitionExamStatus(examId, "in_review", user.userId);
  revalidatePath("/admin/catalogo");
}

export async function approveExamAction(formData: FormData): Promise<void> {
  const user = await requirePermission("content:review");
  const examId = formData.get("examId");
  if (typeof examId !== "string") throw new Error("Vestibular inválido.");
  await transitionExamStatus(examId, "approved", user.userId);
  revalidatePath("/admin/catalogo");
}
