
import { prisma } from "../../../shared/database/prisma.js";

const REALIZED_TRADE_FILTER = {
  exitPrice: {
    not: null,
  },
} as const;

export class DashboardRepository {

  async getTradeStatistics(userId: string) {

    const trades = await prisma.trade.findMany({
      where: {
        userId,
        deletedAt: null,
        ...REALIZED_TRADE_FILTER,
      },
      select: {
        netPnl: true,
        rrRatio: true,
      },
    });

    return trades;
  }

  async getEquityCurveData(userId: string) {
  return prisma.trade.findMany({
    where: {
      userId,
      deletedAt: null,
      ...REALIZED_TRADE_FILTER,
      exitTime: {
        not: null,
      },
    },

    orderBy: {
      exitTime: "asc",
    },

    select: {
      exitTime: true,
      netPnl: true,
    },
  });
}

async getMonthlyPerformance(userId: string) {
  return prisma.trade.findMany({
    where: {
      userId,
      deletedAt: null,
      ...REALIZED_TRADE_FILTER,
      exitTime: {
        not: null,
      },
    },

    orderBy: {
      exitTime: "asc",
    },

    select: {
      exitTime: true,
      netPnl: true,
    },
  });
}
async getMonthlyPerformanceData(userId: string) {
  return prisma.trade.findMany({
    where: {
      userId,
      deletedAt: null,
      ...REALIZED_TRADE_FILTER,
      exitTime: {
        not: null,
      },
    },
    orderBy: {
      exitTime: "asc",
    },
    select: {
      exitTime: true,
      netPnl: true,
    },
  });
}

async getWinLossData(userId: string) {
  return prisma.trade.findMany({
    where: {
      userId,
      deletedAt: null,
      ...REALIZED_TRADE_FILTER,
    },
    select: {
      netPnl: true,
    },
  });
}
async getStrategyAnalytics(userId: string) {
  return prisma.trade.findMany({
    where: {
      userId,
      deletedAt: null,
      ...REALIZED_TRADE_FILTER,
      strategyId: {
        not: null,
      },
    },

    select: {
      strategyId: true,

      strategy: {
        select: {
          id: true,
          name: true,
        },
      },

      netPnl: true,

      rrRatio: true,
    },
  });
}
async getBrokerAnalytics(userId: string) {
  return prisma.trade.findMany({
    where: {
      userId,
      deletedAt: null,
      ...REALIZED_TRADE_FILTER,
    },

    select: {
      broker: true,
      netPnl: true,
      rrRatio: true,
    },
  });
}
async getMistakeAnalytics(userId: string) {
  return prisma.tradeMistake.findMany({
    where: {
      trade: {
        userId,
        deletedAt: null,
        ...REALIZED_TRADE_FILTER,
      },
    },

    select: {
      mistakeId: true,

      mistake: {
        select: {
          id: true,
          name: true,
        },
      },

      trade: {
        select: {
          netPnl: true,
          rrRatio: true,
        },
      },
    },
  });
}
async getPsychologyAnalytics(userId: string) {
  return prisma.trade.findMany({
    where: {
      userId,
      deletedAt: null,
      ...REALIZED_TRADE_FILTER,
      emotionBefore: {
        not: null,
      },
    },

    select: {
      emotionBefore: true,
      netPnl: true,
      rrRatio: true,
    },
  });
}
async getCalendarData(userId: string) {
  return prisma.trade.findMany({
    where: {
      userId,
      deletedAt: null,
      ...REALIZED_TRADE_FILTER,
      exitTime: {
        not: null,
      },
    },

    orderBy: {
      exitTime: "asc",
    },

    select: {
      exitTime: true,
      netPnl: true,
    },
  });
}
async getDrawdownData(userId: string) {
  return prisma.trade.findMany({
    where: {
      userId,
      deletedAt: null,
      ...REALIZED_TRADE_FILTER,
      exitTime: {
        not: null,
      },
    },

    orderBy: {
      exitTime: "asc",
    },

    select: {
      exitTime: true,
      netPnl: true,
    },
  });
}
async getHoldingTimeData(userId: string) {
  return prisma.trade.findMany({
    where: {
      userId,
      deletedAt: null,
      ...REALIZED_TRADE_FILTER,
      exitTime: {
        not: null,
      },
    },

    select: {
      entryTime: true,
      exitTime: true,
      netPnl: true,
      rrRatio: true,
    },
  });
}

async getDayOfWeekData(userId: string) {
  return prisma.trade.findMany({
    where: {
      userId,
      deletedAt: null,
      ...REALIZED_TRADE_FILTER,
      exitTime: {
        not: null,
      },
    },
    select: {
      exitTime: true,
      netPnl: true,
      rrRatio: true,
    },
    orderBy: {
      exitTime: "asc",
    },
  });
}

async getConfidenceData(userId: string) {
  return prisma.trade.findMany({
    where: {
      userId,
      deletedAt: null,
      ...REALIZED_TRADE_FILTER,
    },
    select: {
      confidence: true,
      netPnl: true,
      rrRatio: true,
    },
    orderBy: {
      confidence: "asc",
    },
  });
}

async getTradeStreakData(userId: string) {
  return prisma.trade.findMany({
    where: {
      userId,
      deletedAt: null,
      ...REALIZED_TRADE_FILTER,
      exitTime: {
        not: null,
      },
    },
    select: {
      exitTime: true,
      netPnl: true,
    },
    orderBy: {
      exitTime: "asc",
    },
  });
}

async getTimeOfDayData(userId: string) {
  return prisma.trade.findMany({
    where: {
      userId,
      deletedAt: null,
      ...REALIZED_TRADE_FILTER,
    },
    select: {
      entryTime: true,
      netPnl: true,
      rrRatio: true,
    },
    orderBy: {
      entryTime: "asc",
    },
  });
}
}

export const dashboardRepository =
  new DashboardRepository();
