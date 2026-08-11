import { z } from "zod";

export const simulationStartSchema = z.object({
  mode: z
    .enum(["custom", "quick", "adaptive", "final_review"])
    .default("quick"),
  questionCount: z.coerce.number().int().min(1).max(90).default(10),
  durationMinutes: z.coerce.number().int().min(5).max(360).default(30),
});

export const simulationUpdateSchema = z.object({
  runId: z.string().uuid(),
  answers: z.record(z.string().uuid(), z.string().min(1).max(20)).default({}),
  elapsedSeconds: z.number().int().min(0).max(28_800),
  submit: z.boolean().default(false),
});

export type SimulationStartInput = z.infer<typeof simulationStartSchema>;
export type SimulationUpdateInput = z.infer<typeof simulationUpdateSchema>;
