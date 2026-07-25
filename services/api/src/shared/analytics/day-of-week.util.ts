import {
  calculateAverageRR,
  calculateAverageTrade,
  calculateProfitFactor,
  calculateWinRate,
} from "./core/metrics.util.js";

import { getDayOfWeek } from "./core/bucket.util.js";

type DayTrade = {
  exitTime: Date | null;
  netPnl: number | null;
  rrRatio: number | null;
};

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export function calculateDayOfWeekAnalytics(
  trades: DayTrade[]
) {
  const map = new Map<
    string,
    {
      day: string;
      trades: number;
      wins: number;
      losses: number;
      grossProfit: number;
      grossLoss: number;
      totalRR: number;
      netPnL: number;
    }
  >();

  for (const day of DAYS) {
    map.set(day, {
      day,
      trades: 0,
      wins: 0,
      losses: 0,
      grossProfit: 0,
      grossLoss: 0,
      totalRR: 0,
      netPnL: 0,
    });
  }

  for (const trade of trades) {
    if (!trade.exitTime) continue;

    const day = getDayOfWeek(trade.exitTime);

    const stats = map.get(day)!;

    const pnl = trade.netPnl ?? 0;

    stats.trades++;
    stats.netPnL += pnl;
    stats.totalRR += trade.rrRatio ?? 0;

    if (pnl > 0) {
      stats.wins++;
      stats.grossProfit += pnl;
    } else if (pnl < 0) {
      stats.losses++;
      stats.grossLoss += pnl;
    }
  }

  return DAYS.map((day) => {
    const d = map.get(day)!;

    return {
      day: d.day,
      trades: d.trades,
      wins: d.wins,
      losses: d.losses,

      winRate: calculateWinRate(
        d.wins,
        d.trades
      ),

      averageRR: calculateAverageRR(
        d.totalRR,
        d.trades
      ),

      averageTrade: calculateAverageTrade(
        d.netPnL,
        d.trades
      ),

      netPnL: Number(d.netPnL.toFixed(2)),

      profitFactor: calculateProfitFactor(
        d.grossProfit,
        d.grossLoss
      ),
    };
  });
}

