"use server";

import {
  loginSchema,
  onboardingSchema,
  registrationSchema,
} from "@aprendevest/contracts";
import {
  completeProfile,
  createStudent,
  findActiveUserByEmail,
  requestUserDeletion,
} from "@aprendevest/db";
import { redirect } from "next/navigation";

import { hashPassword, verifyPassword } from "../../lib/auth/password";
import {
  createSession,
  deleteSession,
  getCurrentUser,
} from "../../lib/auth/session";
import { checkRateLimit } from "../../lib/security/rate-limit";

export type AuthFormState = {
  message?: string;
  errors?: Record<string, string[]>;
};

const privacyPolicyVersion = "2026-08-11";

function fields(error: {
  flatten(): { fieldErrors: Record<string, string[]> };
}) {
  return error.flatten().fieldErrors;
}

export async function signup(
  _state: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = registrationSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    privacyAccepted: formData.get("privacyAccepted") === "on",
  });

  if (!parsed.success) return { errors: fields(parsed.error) };
  const rate = checkRateLimit(`signup:${parsed.data.email.toLowerCase()}`, {
    limit: 5,
    windowMs: 15 * 60_000,
  });
  if (!rate.allowed)
    return { message: "Muitas tentativas. Aguarde antes de tentar novamente." };

  let userId: string;
  try {
    const passwordHash = await hashPassword(parsed.data.password);
    const user = await createStudent({
      email: parsed.data.email,
      displayName: parsed.data.name,
      passwordHash,
      policyVersion: privacyPolicyVersion,
    });
    userId = user.id;
    await createSession(userId);
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "23505"
    ) {
      return { message: "Já existe uma conta com este e-mail." };
    }
    return {
      message: "Não foi possível criar sua conta agora. Tente novamente.",
    };
  }

  redirect("/boas-vindas");
}

export async function login(
  _state: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) return { errors: fields(parsed.error) };
  const rate = checkRateLimit(`login:${parsed.data.email.toLowerCase()}`, {
    limit: 8,
    windowMs: 15 * 60_000,
  });
  if (!rate.allowed)
    return { message: "Muitas tentativas. Aguarde antes de tentar novamente." };

  try {
    const user = await findActiveUserByEmail(parsed.data.email);
    const passwordMatches =
      user && user.passwordHash
        ? await verifyPassword(parsed.data.password, user.passwordHash)
        : await hashPassword(parsed.data.password).then(() => false);

    if (!user || !passwordMatches) {
      return { message: "E-mail ou senha incorretos." };
    }

    await createSession(user.id);
  } catch {
    return { message: "Não foi possível entrar agora. Tente novamente." };
  }

  redirect("/app");
}

export async function logout(): Promise<void> {
  await deleteSession();
  redirect("/");
}

export async function finishOnboarding(
  _state: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const user = await getCurrentUser();
  if (!user) redirect("/entrar");

  const parsed = onboardingSchema.safeParse({
    targetCourse: formData.get("targetCourse"),
    targetExams: formData.getAll("targetExams"),
    weeklyMinutes: Number(formData.get("weeklyMinutes")),
    currentLevel: formData.get("currentLevel"),
    ageGroup: formData.get("ageGroup"),
  });
  if (!parsed.success) return { errors: fields(parsed.error) };

  try {
    await completeProfile(user.userId, parsed.data);
  } catch {
    return { message: "Não foi possível salvar seu objetivo agora." };
  }

  redirect("/app");
}

export async function deleteAccount(): Promise<void> {
  const user = await getCurrentUser();
  if (!user) redirect("/entrar");
  await requestUserDeletion(user.userId);
  await deleteSession();
  redirect("/?conta=exclusao-solicitada");
}
