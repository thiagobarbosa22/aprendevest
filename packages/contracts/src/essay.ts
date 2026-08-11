import { z } from "zod";

export const essayDraftSchema = z.object({
  themeId: z.string().uuid(),
  title: z.string().trim().min(3).max(160),
  text: z.string().trim().min(30).max(20_000),
  submitForReview: z.boolean().default(false),
});

export type EssayDraftInput = z.infer<typeof essayDraftSchema>;
