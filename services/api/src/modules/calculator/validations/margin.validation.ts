import { z } from "zod";

export const marginCalculatorSchema = z.object({
  capital: z.number().positive(),

  leverage: z.number().positive(),

  entryPrice: z.number().positive(),
});