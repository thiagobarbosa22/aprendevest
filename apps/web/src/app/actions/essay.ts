"use server";

import { essayDraftSchema } from "@aprendevest/contracts";
import {
  deleteUserEssay,
  isFeatureEnabled,
  saveEssaySubmission,
} from "@aprendevest/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "../../lib/auth/guards";

export async function saveEssayAction(formData: FormData) {
  const user = await requireUser();
  if (!(await isFeatureEnabled("essays", user.userId)))
    redirect("/app?erro=recurso-indisponivel");
  const parsed = essayDraftSchema.safeParse({
    themeId: formData.get("themeId"),
    title: formData.get("title"),
    text: formData.get("text"),
    submitForReview: formData.get("intent") === "submit",
  });
  if (!parsed.success) redirect("/app/redacao?erro=texto-invalido");
  try {
    await saveEssaySubmission(user.userId, parsed.data);
  } catch {
    redirect("/app/redacao?erro=nao-foi-possivel-salvar");
  }
  revalidatePath("/app/redacao");
  redirect("/app/redacao?salvo=1");
}

export async function deleteEssayAction(formData: FormData) {
  const user = await requireUser();
  await deleteUserEssay(user.userId, String(formData.get("submissionId")));
  revalidatePath("/app/redacao");
}
