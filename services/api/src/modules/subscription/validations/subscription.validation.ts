import { z } from "zod";

export const paginationQuerySchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
});

export const verifySubscriptionSchema = z.object({
    paymentId: z.string().min(1),
    subscriptionId: z.string().min(1),
    signature: z.string().min(1),
});
