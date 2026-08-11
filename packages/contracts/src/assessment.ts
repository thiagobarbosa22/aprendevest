import { z } from "zod";

export const questionAttemptSchema = z.object({
  questionId: z.uuid(),
  answer: z.string().trim().min(1).max(10_000),
  durationSeconds: z.number().int().min(0).max(14_400),
  idempotencyKey: z.uuid(),
  context: z.enum(["practice", "exam", "simulation", "review"]),
});

export const errorClassificationSchema = z.enum([
  "content",
  "interpretation",
  "calculation",
  "distraction",
  "time",
]);
export type QuestionAttemptInput = z.infer<typeof questionAttemptSchema>;
