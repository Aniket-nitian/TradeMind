import { z } from "zod";

export const createConversationSchema = z.object({
  title: z.string().trim().max(200).optional(),
  contextType: z.string().trim().max(50).optional(),
});

export const addMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().trim().min(1).max(10000),
});

export const upsertMemorySchema = z.object({
  summary: z.string().trim().min(1).max(4000),
});

export type CreateConversationInput = z.infer<
  typeof createConversationSchema
>;
export type AddMessageInput = z.infer<typeof addMessageSchema>;
export type UpsertMemoryInput = z.infer<typeof upsertMemorySchema>;
