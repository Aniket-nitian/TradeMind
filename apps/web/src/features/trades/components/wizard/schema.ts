import { z } from "zod";

import { EMOTIONS, PRODUCTS, SEGMENTS, SIDES } from "@/lib/constants";

export const wizardSchema = z.object({
  symbol: z.string().min(1, "Symbol is required.").toUpperCase(),
  segment: z.enum(SEGMENTS),
  product: z.enum(PRODUCTS),
  side: z.enum(SIDES),
  quantity: z.coerce.number().positive("Quantity must be positive."),
  entryPrice: z.coerce.number().positive("Entry price must be positive."),
  exitPrice: z.coerce.number().positive().optional().or(z.literal("")),
  entryTime: z.string().min(1, "Entry time is required."),
  exitTime: z.string().optional(),

  stopLoss: z.coerce.number().positive().optional().or(z.literal("")),
  target: z.coerce.number().positive().optional().or(z.literal("")),
  strategyId: z.string().optional(),
  confidence: z.coerce.number().min(1).max(10),

  emotionBefore: z.enum(EMOTIONS).optional(),
  reasonForEntry: z.string().optional(),
  reasonForExit: z.string().optional(),
  tradeNotes: z.string().optional(),
  lessonLearned: z.string().optional(),
});

export type WizardFormInput = z.input<typeof wizardSchema>;
export type WizardFormValues = z.infer<typeof wizardSchema>;

export const STEP_FIELDS: Record<number, (keyof WizardFormInput)[]> = {
  0: ["symbol", "segment", "product", "side", "quantity", "entryPrice", "exitPrice", "entryTime", "exitTime"],
  1: ["stopLoss", "target", "strategyId", "confidence"],
  2: ["emotionBefore", "reasonForEntry", "reasonForExit", "tradeNotes", "lessonLearned"],
  3: [],
};

export const WIZARD_STEPS = [
  "Trade Info",
  "Risk & Strategy",
  "Mindset & Reflection",
  "Review",
];
