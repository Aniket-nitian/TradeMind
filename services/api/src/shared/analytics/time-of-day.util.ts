import {
  calculateAverageRR,
  calculateAverageTrade,
  calculateProfitFactor,
  calculateWinRate,
} from "./core/metrics.util.js";

import { getTimeOfDayBucket } from "./core/bucket.util.js";

type TimeOfDayTrade = {
  entryTime: Date | null;
  netPnl: number | null;
  rrRatio: number | null;
};

const SESSIONS = [
  "09:15-10:00",
  "10:00-11:00",
  "11:00-12:00",
  "12:00-14:00",
  "14:00-15:30",
];

export function calculateTimeOfDayAnalytics(
  trades: TimeOfDayTrade[]
) {
  const map = new Map(
    SESSIONS.map((session) => [
      session,
      {
        session,
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
    if (!trade.entryTime) continue;

    const session = getTimeOfDayBucket(trade.entryTime);

    const stats = map.get(session);

    if (!stats) continue;

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

  return SESSIONS.map((session) => {
    const s = map.get(session)!;

    return {
      session: s.session,
      trades: s.trades,
      wins: s.wins,
      losses: s.losses,

      winRate: calculateWinRate(
        s.wins,
        s.trades
      ),

      averageRR: calculateAverageRR(
        s.totalRR,
        s.trades
      ),

      averageTrade: calculateAverageTrade(
        s.netPnL,
        s.trades
      ),

      netPnL: Number(s.netPnL.toFixed(2)),

      profitFactor: calculateProfitFactor(
        s.grossProfit,
        s.grossLoss
      ),
    };
  });
}