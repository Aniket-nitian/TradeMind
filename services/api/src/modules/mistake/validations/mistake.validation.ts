import { z } from "zod";

export const createMistakeSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Mistake name must be at least 2 characters.")
    .max(100),

  description: z
    .string()
    .trim()
    .max(1000)
    .optional(),
});

export const updateMistakeSchema =
  createMistakeSchema.partial();

export type CreateMistakeDto =
  z.infer<typeof createMistakeSchema>;

export type UpdateMistakeDto =
  z.infer<typeof updateMistakeSchema>;