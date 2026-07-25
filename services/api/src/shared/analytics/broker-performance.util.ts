import type { Broker } from "../../generated/prisma/enums.js";

type BrokerTrade = {
  broker: Broker | null;
  netPnl: number | null;
  rrRatio: number | null;
};

export function calculateBrokerPerformance(trades: BrokerTrade[]) {
  const brokerMap = new Map<
    string,
    {
      broker: Broker | null;
      trades: number;
      wins: number;
      losses: number;
      grossProfit: number;
      grossLoss: number;
      netPnL: number;
      totalRR: number;
    }
  >();

  for (const trade of trades) {
    const key = trade.broker ?? "MANUAL";

    let stats = brokerMap.get(key);

    if (!stats) {
      stats = {
        broker: trade.broker,
        trades: 0,
        wins: 0,
        losses: 0,
        grossProfit: 0,
        grossLoss: 0,
        netPnL: 0,
        totalRR: 0,
      };

      brokerMap.set(key, stats);
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

  return Array.from(brokerMap.values()).map((s) => {
    const winRate = s.trades === 0 ? 0 : (s.wins / s.trades) * 100;

    const averageRR = s.trades === 0 ? 0 : s.totalRR / s.trades;

    const averageWin = s.wins === 0 ? 0 : s.grossProfit / s.wins;

    const averageLoss = s.losses === 0 ? 0 : s.grossLoss / s.losses;

    const profitFactor =
      s.grossLoss === 0 ? 0 : s.grossProfit / Math.abs(s.grossLoss);

    return {
      broker: s.broker,

      trades: s.trades,

      wins: s.wins,

      losses: s.losses,

      winRate: Number(winRate.toFixed(2)),

      averageRR: Number(averageRR.toFixed(2)),

      averageWin: Number(averageWin.toFixed(2)),

      averageLoss: Number(averageLoss.toFixed(2)),

      netPnL: Number(s.netPnL.toFixed(2)),

      profitFactor: Number(profitFactor.toFixed(2)),
    };
  });
}
