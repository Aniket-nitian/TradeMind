import { z } from "zod";
import { Broker } from "../../../generated/prisma/enums.js";

export const updateProfileSchema = z.object({
  firstName: z.string().min(2).max(50).optional(),

  lastName: z.string().max(50).optional(),

  username: z
    .string()
    .min(3)
    .max(30)
    .regex(/^[a-zA-Z0-9_]+$/)
    .optional(),

  bio: z.string().max(500).optional(),

  avatarUrl: z.string().url().optional(),

  tradingExperience: z.enum([
    "BEGINNER",
    "INTERMEDIATE",
    "ADVANCED",
    "PROFESSIONAL",
  ]).optional(),

  riskProfile: z.enum([
    "LOW",
    "MEDIUM",
    "HIGH",
  ]).optional(),

  preferredBroker: z.nativeEnum(Broker).optional(),

  tradingStyle: z.enum([
    "INTRADAY",
    "SWING",
    "POSITIONAL",
    "SCALPING",
    "INVESTOR",
  ]).optional(),

  timezone: z.string().optional(),

  currency: z.string().optional(),

  defaultAccountSize: z.number().positive().optional(),

  defaultRiskPercent: z.number().min(0).max(100).optional(),

  brokerSyncLookbackDays: z.number().int().min(1).max(1095).optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

export const notificationPreferencesSchema = z.object({
  emailNotificationsEnabled: z.boolean().optional(),
  whatsappNotificationsEnabled: z.boolean().optional(),
});

export const deactivateAccountSchema = z.object({
  password: z.string().min(1),
});

export type NotificationPreferencesInput = z.infer<
  typeof notificationPreferencesSchema
>;
export type DeactivateAccountInput = z.infer<
  typeof deactivateAccountSchema
>;