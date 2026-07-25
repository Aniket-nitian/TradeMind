import { z } from "zod";

export const pivotPointSchema = z.object({
  high: z.number().positive(),

  low: z.number().positive(),

  close: z.number().positive()
});

export const fibonacciSchema = z.object({
  high: z.number().positive(),

  low: z.number().positive()
});