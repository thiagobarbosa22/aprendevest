import { z } from "zod";

export const contentBlockSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("heading"), text: z.string().min(1).max(180) }),
  z.object({
    type: z.literal("paragraph"),
    text: z.string().min(1).max(5_000),
  }),
  z.object({
    type: z.literal("example"),
    title: z.string().min(1).max(180),
    text: z.string().min(1).max(5_000),
  }),
  z.object({
    type: z.literal("formula"),
    expression: z.string().min(1).max(500),
    description: z.string().min(1).max(1_000),
  }),
  z.object({
    type: z.literal("check"),
    question: z.string().min(1).max(1_000),
    answer: z.string().min(1).max(1_000),
  }),
]);

export const lessonDraftSchema = z.object({
  moduleId: z.uuid(),
  topicId: z.uuid(),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: z.string().trim().min(3).max(180),
  summary: z.string().trim().min(20).max(1_000),
  estimatedMinutes: z.number().int().min(5).max(240),
  objectives: z.array(z.string().trim().min(5).max(240)).min(1).max(8),
  body: z.array(contentBlockSchema).min(1).max(100),
  accessibleText: z.string().trim().min(20).max(30_000),
  sourceUrl: z.url(),
  rightsStatus: z.enum(["official_link", "authorized", "platform_authored"]),
  mediaUrl: z.url().optional(),
  transcript: z.string().max(100_000).optional(),
});

export const contentProgressSchema = z.object({
  contentId: z.uuid(),
  percent: z.number().min(0).max(100),
  positionSeconds: z.number().int().min(0).max(86_400).default(0),
  complete: z.boolean().default(false),
});

export const contentNoteSchema = z.object({
  contentId: z.uuid(),
  body: z.string().trim().min(1).max(4_000),
  timestampSeconds: z.number().int().min(0).max(86_400).optional(),
});

export type ContentBlock = z.infer<typeof contentBlockSchema>;
export type LessonDraftInput = z.infer<typeof lessonDraftSchema>;
export type ContentProgressInput = z.infer<typeof contentProgressSchema>;
export type ContentNoteInput = z.infer<typeof contentNoteSchema>;
