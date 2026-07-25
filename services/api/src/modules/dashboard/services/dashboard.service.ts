import { calculateBrokerPerformance } from "../../../shared/analytics/broker-performance.util.js";
import { calculateCalendarHeatmap } from "../../../shared/analytics/calendar-heatmap.util.js";
import { calculateConfidenceAnalytics } from "../../../shared/analytics/confidence.util.js";
import { calculateDayOfWeekAnalytics } from "../../../shared/analytics/day-of-week.util.js";
import { calculateDrawdown } from "../../../shared/analytics/drawdown.util.js";
import { calculateHoldingTimeAnalytics } from "../../../shared/analytics/holding-time.util.js";
import { calculateMistakePerformance } from "../../../shared/analytics/mistake-performance.util.js";
import { calculatePsychologyPerformance } from "../../../shared/analytics/psychology-performance.util.js";
import { calculateStrategyPerformance } from "../../../shared/analytics/strategy-performance.util.js";
import { calculateTimeOfDayAnalytics } from "../../../shared/analytics/time-of-day.util.js";
import { calculateTradeStreakAnalytics } from "../../../shared/analytics/trade-streak.util.js";
import { dashboardRepository } from "../repositories/dashboard.repository.js";

export class DashboardService {

  async getOverview(userId: string) {

    const trades =
      await dashboardRepository.getTradeStatistics(userId);

    const totalTrades = trades.length;

    const winningTrades =
      trades.filter(t => (t.netPnl ?? 0) > 0).length;

    const losingTrades =
      trades.filter(t => (t.netPnl ?? 0) < 0).length;

    const breakevenTrades =
      trades.filter(t => (t.netPnl ?? 0) === 0).length;

    const grossProfit =
      trades
        .filter(t => (t.netPnl ?? 0) > 0)
        .reduce((sum, t) => sum + (t.netPnl ?? 0), 0);

    const grossLoss =
      trades
        .filter(t => (t.netPnl ?? 0) < 0)
        .reduce((sum, t) => sum + (t.netPnl ?? 0), 0);

    const netPnL =
      trades.reduce(
        (sum, t) => sum + (t.netPnl ?? 0),
        0
      );

    const averageRR =
      trades.length
        ? trades.reduce(
            (sum, t) => sum + (t.rrRatio ?? 0),
            0
          ) / trades.length
        : 0;

    const averageWin =
      winningTrades
        ? grossProfit / winningTrades
        : 0;

    const averageLoss =
      losingTrades
        ? grossLoss / losingTrades
        : 0;

    const winRate =
      totalTrades
        ? (winningTrades / totalTrades) * 100
        : 0;

    const profitFactor =
      grossLoss === 0
        ? 0
        : grossProfit / Math.abs(grossLoss);

    const expectancy =
      totalTrades === 0
        ? 0
        : netPnL / totalTrades;

    return {
      totalTrades,
      winningTrades,
      losingTrades,
      breakevenTrades,

      winRate: Number(winRate.toFixed(2)),

      grossProfit,
      grossLoss,
      netPnL,

      averageWin: Number(averageWin.toFixed(2)),
      averageLoss: Number(averageLoss.toFixed(2)),
      averageRR: Number(averageRR.toFixed(2)),

      profitFactor: Number(profitFactor.toFixed(2)),
      expectancy: Number(expectancy.toFixed(2)),
    };
  }

  async getEquityCurve(userId: string) {
  const trades =
    await dashboardRepository.getEquityCurveData(userId);

  let cumulativeEquity = 0;

  const equityCurve = trades.map((trade) => {
    cumulativeEquity += trade.netPnl ?? 0;

    return {
      date: trade.exitTime!.toISOString().split("T")[0],
      equity: Number(cumulativeEquity.toFixed(2)),
    };
  });

  return equityCurve;
}
async getMonthlyPerformance(userId: string) {
  const trades =
    await dashboardRepository.getMonthlyPerformanceData(userId);

  const monthlyMap = new Map<string, number>();

  for (const trade of trades) {
    if (!trade.exitTime) continue;

    const month = trade.exitTime.toLocaleString("en-US", {
      month: "short",
      year: "numeric",
    });

    monthlyMap.set(
      month,
      (monthlyMap.get(month) ?? 0) + (trade.netPnl ?? 0)
    );
  }

  return Array.from(monthlyMap.entries()).map(
    ([month, profit]) => ({
      month,
      profit: Number(profit.toFixed(2)),
    })
  );
}

async getWinLossDistribution(userId: string) {
  const trades =
    await dashboardRepository.getWinLossData(userId);

  let wins = 0;
  let losses = 0;
  let breakeven = 0;

  for (const trade of trades) {
    const pnl = trade.netPnl ?? 0;

    if (pnl > 0) {
      wins++;
    } else if (pnl < 0) {
      losses++;
    } else {
      breakeven++;
    }
  }

  return {
    wins,
    losses,
    breakeven,
  };
}

async getStrategyAnalytics(userId: string) {

  const trades =
    await dashboardRepository.getStrategyAnalytics(userId);

  return calculateStrategyPerformance(trades);

}
async getBrokerAnalytics(userId: string) {

  const trades =
    await dashboardRepository.getBrokerAnalytics(userId);

  return calculateBrokerPerformance(trades);

}

async getMistakeAnalytics(userId: string) {

  const trades =
    await dashboardRepository.getMistakeAnalytics(userId);

  return calculateMistakePerformance(trades);

}

async getPsychologyAnalytics(userId: string) {

  const trades =
    await dashboardRepository.getPsychologyAnalytics(userId);

  return calculatePsychologyPerformance(trades);

}

async getCalendarHeatmap(userId: string) {

    const trades =
        await dashboardRepository.getCalendarData(userId);

    return calculateCalendarHeatmap(trades);

}

async getDrawdownAnalytics(userId: string) {

  const trades =
    await dashboardRepository.getDrawdownData(userId);

  return calculateDrawdown(trades);

}

async getHoldingTimeAnalytics(userId: string) {
    const trades =
        await dashboardRepository.getHoldingTimeData(userId);

    return calculateHoldingTimeAnalytics(trades);
}
async getDayOfWeekAnalytics(userId: string) {
  const trades =
    await dashboardRepository.getDayOfWeekData(userId);

  return calculateDayOfWeekAnalytics(trades);
}

async getTimeOfDayAnalytics(userId: string) {
  const trades =
    await dashboardRepository.getTimeOfDayData(userId);

  return calculateTimeOfDayAnalytics(trades);
}



async getConfidenceAnalytics(userId: string) {

    const trades =
        await dashboardRepository.getConfidenceData(userId);

    return calculateConfidenceAnalytics(trades);

}


async getTradeStreakAnalytics(userId: string) {
  const trades =
    await dashboardRepository.getTradeStreakData(userId);

  return calculateTradeStreakAnalytics(trades);
}
}

export const dashboardService =
  new DashboardService();