import { prisma } from "../../../shared/database/prisma.js";
import { Broker, CsvImportStatus } from "../../../generated/prisma/enums.js";
import type { Prisma } from "../../../generated/prisma/client.js";

export class BrokerRepository {
    async upsertAccount(
        userId: string,
        data: {
            broker: Broker;
            brokerUserId: string;
            accessTokenEnc: string;
            tokenExpiresAt?: Date;
            refreshTokenEnc?: string | null;
        }
    ) {
        return prisma.brokerAccount.upsert({
            where: {
                userId_broker: {
                    userId,
                    broker: data.broker,
                },
            },
            create: {
                userId,
                broker: data.broker,
                brokerUserId: data.brokerUserId,
                accessTokenEnc: data.accessTokenEnc,
                tokenExpiresAt: data.tokenExpiresAt,
                refreshTokenEnc: data.refreshTokenEnc,
                isConnected: true,
            },
            update: {
                brokerUserId: data.brokerUserId,
                accessTokenEnc: data.accessTokenEnc,
                tokenExpiresAt: data.tokenExpiresAt,
                refreshTokenEnc: data.refreshTokenEnc,
                isConnected: true,
                deletedAt: null,
            },
        });
    }

    async updateAccessToken(
        accountId: string,
        data: { accessTokenEnc: string; tokenExpiresAt: Date }
    ) {
        return prisma.brokerAccount.update({
            where: { id: accountId },
            data: {
                accessTokenEnc: data.accessTokenEnc,
                tokenExpiresAt: data.tokenExpiresAt,
            },
        });
    }

    async findAccount(userId: string, broker: Broker) {
        return prisma.brokerAccount.findFirst({
            where: {
                userId,
                broker,
                deletedAt: null,
            },
        });
    }

    async listAccounts(userId: string) {
        return prisma.brokerAccount.findMany({
            where: {
                userId,
                deletedAt: null,
            },
            select: {
                id: true,
                broker: true,
                brokerUserId: true,
                isConnected: true,
                lastSyncedAt: true,
                tokenExpiresAt: true,
                createdAt: true,
                updatedAt: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }

    async disconnectAccount(userId: string, broker: Broker) {
        return prisma.brokerAccount.updateMany({
            where: {
                userId,
                broker,
                deletedAt: null,
            },
            data: {
                isConnected: false,
                accessTokenEnc: null,
                refreshTokenEnc: null,
                tokenExpiresAt: null,
            },
        });
    }

    async updateLastSyncedAt(accountId: string, lastSyncedAt: Date) {
        return prisma.brokerAccount.update({
            where: {
                id: accountId,
            },
            data: {
                lastSyncedAt,
            },
        });
    }

    async createSyncLog(data: {
        userId: string;
        brokerAccountId: string;
        broker: Broker;
        fromDate: Date;
        toDate: Date;
        totalFetched: number;
        matchedTrades: number;
    }) {
        return prisma.brokerSyncLog.create({
            data,
        });
    }

    async updateSyncLog(
        id: string,
        data: {
            status: CsvImportStatus;
            importedRows: number;
            duplicateRows: number;
            errors?: unknown[];
        }
    ) {
        return prisma.brokerSyncLog.update({
            where: {
                id,
            },
            data: {
                status: data.status,
                importedRows: data.importedRows,
                duplicateRows: data.duplicateRows,
                errors: data.errors as Prisma.InputJsonValue,
            },
        });
    }

    async findSyncHistory(userId: string, page = 1, limit = 20) {
        const skip = (page - 1) * limit;

        const [logs, total] = await prisma.$transaction([
            prisma.brokerSyncLog.findMany({
                where: {
                    userId,
                },
                skip,
                take: limit,
                orderBy: {
                    createdAt: "desc",
                },
            }),

            prisma.brokerSyncLog.count({
                where: {
                    userId,
                },
            }),
        ]);

        return {
            logs,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
                hasNext: page * limit < total,
                hasPrevious: page > 1,
            },
        };
    }

    async findSyncLogById(id: string, userId: string) {
        return prisma.brokerSyncLog.findFirst({
            where: {
                id,
                userId,
            },
        });
    }

    async listAllConnectedAccounts() {
        return prisma.brokerAccount.findMany({
            where: {
                isConnected: true,
                deletedAt: null,
            },
            select: {
                userId: true,
                broker: true,
            },
        });
    }
}
