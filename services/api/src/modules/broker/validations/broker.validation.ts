import { z } from "zod";
import { Broker } from "../../../generated/prisma/enums.js";

export const connectBrokerSchema = z.object({
    broker: z.nativeEnum(Broker),
    dhanClientId: z.string().trim().min(1).optional(),
    accessToken: z.string().trim().min(1).optional(),
    apiKey: z.string().trim().min(1).optional(),
    apiSecret: z.string().trim().min(1).optional(),
    totpSecret: z.string().trim().min(1).optional(),
}).refine(
    (data) => data.accessToken || (data.apiKey && (data.apiSecret || data.totpSecret)),
    { message: "Missing required credentials for the selected broker." }
);

export const brokerParamSchema = z.object({
    broker: z.nativeEnum(Broker),
});

export const syncHistoryQuerySchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
});
