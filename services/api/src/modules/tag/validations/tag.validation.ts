import { z } from "zod";

export const createTagSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Tag name must be at least 2 characters.")
    .max(50, "Tag name cannot exceed 50 characters."),

  color: z
    .string()
    .trim()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid HEX color.")
    .optional(),
});

export const updateTagSchema = createTagSchema.partial();

export type CreateTagDto = z.infer<typeof createTagSchema>;
export type UpdateTagDto = z.infer<typeof updateTagSchema>;