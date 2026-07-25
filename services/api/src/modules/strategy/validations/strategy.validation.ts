import { z } from "zod";

export const createStrategySchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Strategy name must be at least 3 characters")
    .max(100),

  description: z.string().trim().max(1000).optional(),

  setupRules: z.string().trim().max(3000).optional(),

  entryRules: z.string().trim().max(3000).optional(),

  exitRules: z.string().trim().max(3000).optional(),

  riskRules: z.string().trim().max(3000).optional(),

  timeframe: z.string().trim().max(50).optional(),

  market: z.string().trim().max(100).optional(),
});

export const updateStrategySchema = createStrategySchema.partial();

export type CreateStrategyDto = z.infer<typeof createStrategySchema>;
export type UpdateStrategyDto = z.infer<typeof updateStrategySchema>;