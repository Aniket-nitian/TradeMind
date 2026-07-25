import { z } from "zod";
import { Broker, Emotion, Exchange } from "../../../generated/prisma/enums.js";

export const createTradeSchema = z.object({
  broker: z.nativeEnum(Broker).optional(),

  exchange: z.nativeEnum(Exchange).optional(),

  symbol: z.string().min(1),

  segment: z.enum([
    "EQUITY",
    "FUTURES",
    "OPTIONS",
    "CURRENCY",
    "COMMODITY",
  ]),

  product: z.enum([
    "CNC",
    "MIS",
    "NRML",
  ]),

  side: z.enum([
    "BUY",
    "SELL",
  ]),

  quantity: z.number().positive(),

  entryPrice: z.number().positive(),

  exitPrice: z.number().optional(),

  stopLoss: z.number().optional(),

  target: z.number().optional(),

  brokerage: z.number().default(0),

  taxes: z.number().default(0),

  confidence: z.number().min(1).max(10).optional(),

  strategyId: z.string().optional(),

  tradeNotes: z.string().optional(),

  lessonLearned: z.string().optional(),

  reasonForEntry: z.string().trim().max(2000).optional(),

  reasonForExit: z.string().trim().max(2000).optional(),

  followedPlan: z.boolean().optional(),

  emotionBefore: z.nativeEnum(Emotion).optional(),

  emotionAfter: z.nativeEnum(Emotion).optional(),

  entryTime: z.string(),

  exitTime: z.string().optional(),
});

export const updateTradeSchema =
  createTradeSchema.partial();

export type CreateTradeInput =
  z.infer<typeof createTradeSchema>;

export type UpdateTradeInput =
  z.infer<typeof updateTradeSchema>;

export const searchTradesSchema = z.object({
  q: z.string().trim().min(1),
  limit: z.coerce.number().min(1).max(20).optional(),
});

export type SearchTradesQuery = z.infer<typeof searchTradesSchema>;

  export const updateJournalSchema = z.object({
  tradeNotes: z
    .string()
    .trim()
    .max(5000)
    .optional(),

  lessonLearned: z
    .string()
    .trim()
    .max(2000)
    .optional(),

  reasonForEntry: z
    .string()
    .trim()
    .max(2000)
    .optional(),

  reasonForExit: z
    .string()
    .trim()
    .max(2000)
    .optional(),

  followedPlan: z
    .boolean()
    .optional(),
});

export const createChecklistSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Checklist title is required.")
    .max(200),
});

export const updateChecklistSchema = z.object({
  title: z
    .string()
    .trim()
    .max(200)
    .optional(),

  isChecked: z
    .boolean()
    .optional(),
});

export const updateEmotionSchema = z.object({
  emotionBefore: z
    .nativeEnum(Emotion)
    .optional(),

  emotionAfter: z
    .nativeEnum(Emotion)
    .optional(),
});

export type UpdateEmotionDto =
  z.infer<typeof updateEmotionSchema>;

export type CreateChecklistDto =
  z.infer<typeof createChecklistSchema>;

export type UpdateChecklistDto =
  z.infer<typeof updateChecklistSchema>;

export type UpdateJournalDto =
  z.infer<typeof updateJournalSchema>;

export const saveEmbeddingSchema = z.object({
  embedding: z.array(z.number()).min(1),
});

export type SaveEmbeddingDto =
  z.infer<typeof saveEmbeddingSchema>;