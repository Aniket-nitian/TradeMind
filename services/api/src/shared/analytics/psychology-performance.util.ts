type PsychologyTrade = {
  emotionBefore: string | null;
  netPnl: number | null;
  rrRatio: number | null;
};

export function calculatePsychologyPerformance(
  trades: PsychologyTrade[]
) {
  const emotionMap = new Map<
    string,
    {
      emotion: string;
      count: number;
      wins: number;
      losses: number;
      grossProfit: number;
      grossLoss: number;
      netPnL: number;
      totalRR: number;
    }
  >();

  for (const trade of trades) {
    if (!trade.emotionBefore) continue;

    let stats = emotionMap.get(trade.emotionBefore);

    if (!stats) {
      stats = {
        emotion: trade.emotionBefore,
        count: 0,
        wins: 0,
        losses: 0,
        grossProfit: 0,
        grossLoss: 0,
        netPnL: 0,
        totalRR: 0,
      };

      emotionMap.set(trade.emotionBefore, stats);
    }

    const pnl = trade.netPnl ?? 0;

    stats.count++;
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

  return Array.from(emotionMap.values())
    .map((e) => {

      const winRate =
        e.count === 0
          ? 0
          : (e.wins / e.count) * 100;

      const averageRR =
        e.count === 0
          ? 0
          : e.totalRR / e.count;

      const averageTrade =
        e.count === 0
          ? 0
          : e.netPnL / e.count;

      const averageWin =
        e.wins === 0
          ? 0
          : e.grossProfit / e.wins;

      const averageLoss =
        e.losses === 0
          ? 0
          : e.grossLoss / e.losses;

      const profitFactor =
        e.grossLoss === 0
          ? 0
          : e.grossProfit / Math.abs(e.grossLoss);

      return {
        emotion: e.emotion,

        count: e.count,

        wins: e.wins,

        losses: e.losses,

        winRate: Number(winRate.toFixed(2)),

        averageRR: Number(averageRR.toFixed(2)),

        averageTrade: Number(averageTrade.toFixed(2)),

        averageWin: Number(averageWin.toFixed(2)),

        averageLoss: Number(averageLoss.toFixed(2)),

        netPnL: Number(e.netPnL.toFixed(2)),

        profitFactor: Number(profitFactor.toFixed(2)),
      };

    })
    .sort((a, b) => b.netPnL - a.netPnL);
}