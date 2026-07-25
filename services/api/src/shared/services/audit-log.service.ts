import { prisma } from "../database/prisma.js";
import { logger } from "../logger/logger.js";
import type { Prisma } from "../../generated/prisma/client.js";

export async function logAudit(data: {
    userId?: string;
    action: string;
    entity?: string;
    entityId?: string;
    metadata?: Record<string, unknown>;
}) {
    try {
        await prisma.auditLog.create({
            data: {
                userId: data.userId,
                action: data.action,
                entity: data.entity,
                entityId: data.entityId,
                metadata: data.metadata as Prisma.InputJsonValue,
            },
        });
    } catch (error) {
        logger.error({ err: error, action: data.action }, "Failed to write audit log");
    }
}
