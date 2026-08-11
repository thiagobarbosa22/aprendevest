import { z } from "zod";

export const userRoleSchema = z.enum([
  "student",
  "teacher",
  "author",
  "reviewer",
  "editor",
  "support",
  "admin",
]);

const passwordSchema = z
  .string()
  .min(10, "Use pelo menos 10 caracteres.")
  .max(128, "A senha deve ter no máximo 128 caracteres.")
  .regex(/[A-Za-zÀ-ÿ]/, "Inclua pelo menos uma letra.")
  .regex(/[0-9]/, "Inclua pelo menos um número.");

export const registrationSchema = z.object({
  name: z.string().trim().min(2, "Informe seu nome.").max(100),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .pipe(z.email("Informe um e-mail válido.")),
  password: passwordSchema,
  privacyAccepted: z.literal(true, {
    error: "Aceite a Política de Privacidade para continuar.",
  }),
});

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .pipe(z.email("Informe um e-mail válido.")),
  password: z.string().min(1, "Informe sua senha.").max(128),
});

export const onboardingSchema = z.object({
  targetCourse: z.string().trim().min(2).max(120),
  targetExams: z.array(z.string().trim().min(1).max(80)).min(1).max(6),
  weeklyMinutes: z.number().int().min(60).max(3_600),
  currentLevel: z.enum(["beginner", "intermediate", "advanced"]),
  ageGroup: z.enum(["minor", "adult", "undisclosed"]),
});

export type RegistrationInput = z.infer<typeof registrationSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type OnboardingInput = z.infer<typeof onboardingSchema>;
export type UserRole = z.infer<typeof userRoleSchema>;
