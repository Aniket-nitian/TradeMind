import { z } from "zod";

export const positionSizeSchema = z
  .object({
    accountSize: z.coerce.number().positive("Account size must be positive."),
    riskPercent: z.coerce
      .number()
      .positive("Risk % must be positive.")
      .max(100, "Risk % cannot exceed 100."),
    entryPrice: z.coerce.number().positive("Entry price must be positive."),
    stopLoss: z.coerce.number().positive("Stop loss must be positive."),
  })
  .refine((data) => data.entryPrice !== data.stopLoss, {
    message: "Entry price and stop loss cannot be the same.",
    path: ["stopLoss"],
  });

export const riskRewardSchema = z
  .object({
    entryPrice: z.coerce.number().positive("Entry price must be positive."),
    stopLoss: z.coerce.number().positive("Stop loss must be positive."),
    targetPrice: z.coerce.number().positive("Target price must be positive."),
  })
  .refine((data) => data.entryPrice !== data.stopLoss, {
    message: "Entry price and stop loss cannot be the same.",
    path: ["stopLoss"],
  });

export const stockAverageSchema = z.object({
  firstQuantity: z.coerce.number().positive("Quantity must be positive."),
  firstPrice: z.coerce.number().positive("Price must be positive."),
  secondQuantity: z.coerce.number().positive("Quantity must be positive."),
  secondPrice: z.coerce.number().positive("Price must be positive."),
});

export const brokerageSchema = z.object({
  buyPrice: z.coerce.number().positive("Buy price must be positive."),
  sellPrice: z.coerce.number().positive("Sell price must be positive."),
  quantity: z.coerce.number().positive("Quantity must be positive."),
  brokeragePerOrder: z.coerce.number().min(0, "Brokerage cannot be negative."),
});

export const marginSchema = z.object({
  capital: z.coerce.number().positive("Capital must be positive."),
  leverage: z.coerce.number().positive("Leverage must be positive."),
  entryPrice: z.coerce.number().positive("Entry price must be positive."),
});

export const pivotPointSchema = z.object({
  high: z.coerce.number().positive("High must be positive."),
  low: z.coerce.number().positive("Low must be positive."),
  close: z.coerce.number().positive("Close must be positive."),
});

export const fibonacciSchema = z.object({
  high: z.coerce.number().positive("High must be positive."),
  low: z.coerce.number().positive("Low must be positive."),
});

export const cagrSchema = z.object({
  initialValue: z.coerce.number().positive("Initial value must be positive."),
  finalValue: z.coerce.number().positive("Final value must be positive."),
  years: z.coerce.number().positive("Years must be positive."),
});

export const lumpsumSchema = z.object({
  principal: z.coerce.number().positive("Principal must be positive."),
  annualReturn: z.coerce.number().min(0, "Annual return cannot be negative."),
  years: z.coerce.number().positive("Years must be positive."),
});

export const sipSchema = z.object({
  monthlyInvestment: z.coerce
    .number()
    .positive("Monthly investment must be positive."),
  annualReturn: z.coerce.number().min(0, "Annual return cannot be negative."),
  years: z.coerce.number().positive("Years must be positive."),
});

export const goalSchema = z.object({
  targetAmount: z.coerce.number().positive("Target amount must be positive."),
  annualReturn: z.coerce.number().min(0, "Annual return cannot be negative."),
  years: z.coerce.number().positive("Years must be positive."),
});
