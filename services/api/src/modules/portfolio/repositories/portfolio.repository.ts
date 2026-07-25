import { prisma } from "../../../shared/database/prisma.js";
import { CapitalTransactionType } from "../../../generated/prisma/enums.js";

export class PortfolioRepository {
    async createCapitalTransaction(
        userId: string,
        data: {
            type: CapitalTransactionType;
            amount: number;
            note?: string;
            transactionDate: Date;
        }
    ) {
        return prisma.capitalTransaction.create({
            data: {
                userId,
                ...data,
            },
        });
    }

    async findCapitalTransactions(
        userId: string,
        page = 1,
        limit = 20
    ) {
        const skip = (page - 1) * limit;

        const [transactions, total] = await prisma.$transaction([
            prisma.capitalTransaction.findMany({
                where: {
                    userId,
                    deletedAt: null,
                },
                skip,
                take: limit,
                orderBy: {
                    transactionDate: "desc",
                },
            }),

            prisma.capitalTransaction.count({
                where: {
                    userId,
                    deletedAt: null,
                },
            }),
        ]);

        return {
            transactions,
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

    async findCapitalTransactionById(id: string, userId: string) {
        return prisma.capitalTransaction.findFirst({
            where: {
                id,
                userId,
                deletedAt: null,
            },
        });
    }

    async softDeleteCapitalTransaction(id: string) {
        return prisma.capitalTransaction.update({
            where: {
                id,
            },
            data: {
                deletedAt: new Date(),
            },
        });
    }

    async getNetCapital(userId: string) {
        const [deposits, withdrawals] = await prisma.$transaction([
            prisma.capitalTransaction.aggregate({
                where: {
                    userId,
                    deletedAt: null,
                    type: CapitalTransactionType.DEPOSIT,
                },
                _sum: {
                    amount: true,
                },
            }),

            prisma.capitalTransaction.aggregate({
                where: {
                    userId,
                    deletedAt: null,
                    type: CapitalTransactionType.WITHDRAWAL,
                },
                _sum: {
                    amount: true,
                },
            }),
        ]);

        return (
            (deposits._sum.amount ?? 0) - (withdrawals._sum.amount ?? 0)
        );
    }

    async getOpenTrades(userId: string) {
        return prisma.trade.findMany({
            where: {
                userId,
                status: "OPEN",
                deletedAt: null,
            },
            select: {
                symbol: true,
                segment: true,
                product: true,
                side: true,
                quantity: true,
                entryPrice: true,
                exchange: true,
                strategyId: true,
                strategy: {
                    select: {
                        name: true,
                    },
                },
            },
        });
    }

    async getRealizedPnl(userId: string) {
        const result = await prisma.trade.aggregate({
            where: {
                userId,
                status: "CLOSED",
                deletedAt: null,
            },
            _sum: {
                netPnl: true,
            },
        });

        return result._sum.netPnl ?? 0;
    }

    async createSnapshot(
        userId: string,
        data: {
            totalValue: number;
            invested: number;
            unrealizedPnl: number;
            realizedPnl: number;
            cash: number;
        }
    ) {
        return prisma.portfolioSnapshot.create({
            data: {
                userId,
                ...data,
            },
        });
    }

    async findSnapshots(userId: string, page = 1, limit = 20) {
        const skip = (page - 1) * limit;

        const [snapshots, total] = await prisma.$transaction([
            prisma.portfolioSnapshot.findMany({
                where: {
                    userId,
                    deletedAt: null,
                },
                skip,
                take: limit,
                orderBy: {
                    createdAt: "desc",
                },
            }),

            prisma.portfolioSnapshot.count({
                where: {
                    userId,
                    deletedAt: null,
                },
            }),
        ]);

        return {
            snapshots,
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
}

export const portfolioRepository = new PortfolioRepository();
