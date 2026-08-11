import { z } from "zod";
export const examRunUpdateSchema = z.object({
  runId: z.uuid(),
  answers: z.record(z.string(), z.string().max(10_000)).default({}),
  elapsedSeconds: z.number().int().min(0).max(28_800),
  submit: z.boolean().default(false),
});
export type ExamRunUpdateInput = z.infer<typeof examRunUpdateSchema>;
