import {
  calculateAverageRR,
  calculateAverageTrade,
  calculateProfitFactor,
  calculateWinRate,
} from "./core/metrics.util.js";
import { getHoldingTimeBucket } from "./core/bucket.util.js";

type HoldingTrade = {
  entryTime: Date;
  exitTime: Date | null;
  netPnl: number | null;
  rrRatio: number | null;
};

export function calculateHoldingTimeAnalytics(
  trades: HoldingTrade[]
) {
  const bucketMap = new Map<
    string,
    {
      bucket: string;
      trades: number;
      wins: number;
      losses: number;
      grossProfit: number;
      grossLoss: number;
      totalRR: number;
      netPnL: number;
    }
  >();

  for (const trade of trades) {
    if (!trade.exitTime) continue;

    const minutes =
      (trade.exitTime.getTime() - trade.entryTime.getTime()) /
      (1000 * 60);

    const bucket = getHoldingTimeBucket(minutes);

    let stats = bucketMap.get(bucket);

    if (!stats) {
      stats = {
        bucket,
        trades: 0,
        wins: 0,
        losses: 0,
        grossProfit: 0,
        grossLoss: 0,
        totalRR: 0,
        netPnL: 0,
      };

      bucketMap.set(bucket, stats);
    }

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

  return Array.from(bucketMap.values()).map((b) => ({
    bucket: b.bucket,
    trades: b.trades,
    wins: b.wins,
    losses: b.losses,
    winRate: calculateWinRate(b.wins, b.trades),
    averageRR: calculateAverageRR(b.totalRR, b.trades),
    averageTrade: calculateAverageTrade(
      b.netPnL,
      b.trades
    ),
    netPnL: Number(b.netPnL.toFixed(2)),
    profitFactor: calculateProfitFactor(
      b.grossProfit,
      b.grossLoss
    ),
  }));
}