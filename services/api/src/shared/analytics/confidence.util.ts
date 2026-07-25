import {
  calculateAverageRR,
  calculateAverageTrade,
  calculateProfitFactor,
  calculateWinRate,
} from "./core/metrics.util.js";

type ConfidenceTrade = {
  confidence: number;
  netPnl: number | null;
  rrRatio: number | null;
};

export function calculateConfidenceAnalytics(
  trades: ConfidenceTrade[]
) {
  const map = new Map(
    Array.from({ length: 10 }, (_, i) => [
      i + 1,
      {
        confidence: i + 1,
        trades: 0,
        wins: 0,
        losses: 0,
        grossProfit: 0,
        grossLoss: 0,
        totalRR: 0,
        netPnL: 0,
      },
    ])
  );

  for (const trade of trades) {
    const stats = map.get(trade.confidence)!;

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

  return Array.from(map.values()).map((c) => ({
    confidence: c.confidence,
    trades: c.trades,
    wins: c.wins,
    losses: c.losses,

    winRate: calculateWinRate(
      c.wins,
      c.trades
    ),

    averageRR: calculateAverageRR(
      c.totalRR,
      c.trades
    ),

    averageTrade: calculateAverageTrade(
      c.netPnL,
      c.trades
    ),

    netPnL: Number(c.netPnL.toFixed(2)),

    profitFactor: calculateProfitFactor(
      c.grossProfit,
      c.grossLoss
    ),
  }));
  
}

export function getTimeOfDayBucket(date: Date): string {
  const minutes = date.getHours() * 60 + date.getMinutes();

  if (minutes >= 555 && minutes < 600)
    return "09:15-10:00";

  if (minutes >= 600 && minutes < 660)
    return "10:00-11:00";

  if (minutes >= 660 && minutes < 720)
    return "11:00-12:00";

  if (minutes >= 720 && minutes < 840)
    return "12:00-14:00";

  return "14:00-15:30";
}