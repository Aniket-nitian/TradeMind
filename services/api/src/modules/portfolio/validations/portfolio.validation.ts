import { z } from "zod";
import { CapitalTransactionType } from "../../../generated/prisma/enums.js";

export const recordCapitalTransactionSchema = z.object({
    type: z.nativeEnum(CapitalTransactionType),
    amount: z.number().positive(),
    note: z.string().trim().max(500).optional(),
    transactionDate: z.string().optional(),
});

export const paginationQuerySchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
});

export type RecordCapitalTransactionInput = z.infer<
    typeof recordCapitalTransactionSchema
>;
