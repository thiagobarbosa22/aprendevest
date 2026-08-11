import { z } from "zod";

export const examDraftSchema = z.object({
  name: z.string().trim().min(3).max(160),
  acronym: z.string().trim().min(2).max(24),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(100)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use um slug válido."),
  institution: z.string().trim().min(2).max(160),
  board: z.string().trim().min(2).max(120),
  region: z.string().trim().min(2).max(80),
  officialUrl: z.url("Informe uma URL oficial válida."),
  sourceUrl: z.url("Informe a fonte dos metadados."),
  rightsStatus: z.enum(["official_link", "authorized", "platform_authored"]),
  summary: z.string().trim().min(20).max(1_200),
});

export const subjectDraftSchema = z.object({
  name: z.string().trim().min(2).max(100),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(100)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  area: z.enum([
    "languages",
    "mathematics",
    "natural_sciences",
    "human_sciences",
    "interdisciplinary",
  ]),
  summary: z.string().trim().min(10).max(600),
});

export type ExamDraftInput = z.infer<typeof examDraftSchema>;
export type SubjectDraftInput = z.infer<typeof subjectDraftSchema>;
