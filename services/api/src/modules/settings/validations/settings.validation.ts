import { z } from "zod";
import { Broker } from "../../../generated/prisma/enums.js";

export const tradingPreferencesSchema = z.object({
  defaultAccountSize: z.number().positive().optional(),
  defaultRiskPercent: z.number().min(0).max(100).optional(),
});

export const brokerPreferencesSchema = z.object({
  preferredBroker: z.nativeEnum(Broker).optional(),
  brokerSyncLookbackDays: z.number().int().min(1).max(1095).optional(),
});

export type TradingPreferencesInput = z.infer<
  typeof tradingPreferencesSchema
>;
export type BrokerPreferencesInput = z.infer<
  typeof brokerPreferencesSchema
>;
