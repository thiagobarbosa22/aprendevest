import { z } from "zod";

export const enemDisciplines = [
  "linguagens",
  "ciencias-humanas",
  "ciencias-natureza",
  "matematica",
] as const;

export const enemSimulationStartSchema = z.object({
  year: z.coerce.number().int().min(2009).max(2023),
  discipline: z.enum(enemDisciplines),
  language: z.enum(["ingles", "espanhol"]).default("ingles"),
});

export const enemSimulationUpdateSchema = z.object({
  runId: z.string().uuid(),
  answers: z.record(z.string().regex(/^\d+$/), z.string().min(1).max(1)),
  elapsedSeconds: z.number().int().min(0).max(28_800),
  submit: z.boolean().default(false),
});

export type EnemSimulationStartInput = z.infer<
  typeof enemSimulationStartSchema
>;
export type EnemSimulationUpdateInput = z.infer<
  typeof enemSimulationUpdateSchema
>;
