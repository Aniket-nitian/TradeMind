import { z } from "zod";

export const cagrSchema = z.object({
  initialValue: z.number().positive(),
  finalValue: z.number().positive(),
  years: z.number().positive(),
});

export const lumpsumSchema = z.object({
  principal: z.number().positive(),
  annualReturn: z.number().min(0),
  years: z.number().positive(),
});

export const sipSchema = z.object({
  monthlyInvestment: z.number().positive(),
  annualReturn: z.number().min(0),
  years: z.number().positive(),
});

export const goalCalculatorSchema = z.object({
  targetAmount: z.number().positive(),
  annualReturn: z.number().min(0),
  years: z.number().positive(),
});