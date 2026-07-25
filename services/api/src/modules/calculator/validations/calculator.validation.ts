import { z } from "zod";

export const positionSizeSchema = z.object({
  accountSize: z.number().positive(),

  riskPercent: z.number().positive().max(100),

  entryPrice: z.number().positive(),

  stopLoss: z.number().positive(),
});

export const riskRewardSchema = z.object({
  entryPrice: z.number().positive(),

  stopLoss: z.number().positive(),

  targetPrice: z.number().positive(),
});

export const stockAverageSchema = z.object({
  firstQuantity: z.number().positive(),

  firstPrice: z.number().positive(),

  secondQuantity: z.number().positive(),

  secondPrice: z.number().positive(),
});

export const brokerageSchema = z.object({
  buyPrice: z.number().positive(),

  sellPrice: z.number().positive(),

  quantity: z.number().positive(),

  brokeragePerOrder: z.number().min(0),
});