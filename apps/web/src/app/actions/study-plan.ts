"use server";

import {
  completeStudyTask,
  createStudyPlan,
  gradeReview,
} from "@aprendevest/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "../../lib/auth/guards";

export async function submitDiagnostic(formData: FormData) {
  const user = await requireUser();
  const answers = [...formData.entries()]
    .filter(([key]) => key.startsWith("topic:"))
    .map(([key, value]) => ({
      topicId: key.slice(6),
      score: Math.max(0, Math.min(1, Number(value) / 4)),
      confidence: 1,
    }));
  if (!answers.length) redirect("/app/diagnostico?erro=selecione");
  await createStudyPlan(user.userId, answers);
  redirect("/app/plano?novo=1");
}

export async function recalculatePlan() {
  const user = await requireUser();
  await createStudyPlan(user.userId);
  revalidatePath("/app/plano");
  revalidatePath("/app");
}

export async function completeTask(formData: FormData) {
  const user = await requireUser();
  await completeStudyTask(user.userId, String(formData.get("taskId")));
  revalidatePath("/app/plano");
  revalidatePath("/app");
}

export async function reviewQuality(formData: FormData) {
  const user = await requireUser();
  const quality = Number(formData.get("quality"));
  if (![0, 1, 2, 3, 4, 5].includes(quality)) throw new Error("Nota inválida.");
  await gradeReview(
    user.userId,
    String(formData.get("reviewId")),
    quality as 0 | 1 | 2 | 3 | 4 | 5,
  );
  revalidatePath("/app/revisao");
}
