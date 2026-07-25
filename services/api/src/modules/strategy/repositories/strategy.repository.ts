import { prisma } from "../../../shared/database/prisma.js";

class StrategyRepository {
  async create(data: {
    userId: string;
    name: string;
    description?: string;
    setupRules?: string;
    entryRules?: string;
    exitRules?: string;
    riskRules?: string;
    timeframe?: string;
    market?: string;
  }) {
    return prisma.strategy.create({
      data,
    });
  }

  async findAll(userId: string) {
    return prisma.strategy.findMany({
      where: {
        userId,
        deletedAt: null,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findById(id: string, userId: string) {
    return prisma.strategy.findFirst({
      where: {
        id,
        userId,
        deletedAt: null,
      },
    });
  }

  async update(id: string, data: any) {
    return prisma.strategy.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return prisma.strategy.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}

export const strategyRepository = new StrategyRepository();