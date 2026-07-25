type MistakeTrade = {
  mistakeId: string;
  mistake: {
    id: string;
    name: string;
  };
  trade: {
    netPnl: number | null;
    rrRatio: number | null;
  };
};

export function calculateMistakePerformance(
  trades: MistakeTrade[]
) {
  const mistakeMap = new Map<
    string,
    {
      mistakeId: string;
      mistake: string;
      count: number;
      wins: number;
      losses: number;
      grossProfit: number;
      grossLoss: number;
      netPnL: number;
      totalRR: number;
    }
  >();

  for (const item of trades) {

    let stats = mistakeMap.get(item.mistakeId);

    if (!stats) {
      stats = {
        mistakeId: item.mistake.id,
        mistake: item.mistake.name,
        count: 0,
        wins: 0,
        losses: 0,
        grossProfit: 0,
        grossLoss: 0,
        netPnL: 0,
        totalRR: 0,
      };

      mistakeMap.set(item.mistakeId, stats);
    }

    const pnl = item.trade.netPnl ?? 0;

    stats.count++;
    stats.netPnL += pnl;
    stats.totalRR += item.trade.rrRatio ?? 0;

    if (pnl > 0) {
      stats.wins++;
      stats.grossProfit += pnl;
    } else if (pnl < 0) {
      stats.losses++;
      stats.grossLoss += pnl;
    }
  }

  return Array.from(mistakeMap.values())
    .map((m) => {

      const winRate =
        m.count === 0
          ? 0
          : (m.wins / m.count) * 100;

      const averageRR =
        m.count === 0
          ? 0
          : m.totalRR / m.count;

      const averageWin =
        m.wins === 0
          ? 0
          : m.grossProfit / m.wins;

      const averageLoss =
        m.losses === 0
          ? 0
          : m.grossLoss / m.losses;

      const profitFactor =
        m.grossLoss === 0
          ? 0
          : m.grossProfit / Math.abs(m.grossLoss);

      const averageTrade =
        m.count === 0
          ? 0
          : m.netPnL / m.count;

      return {
        mistakeId: m.mistakeId,
        mistake: m.mistake,

        count: m.count,

        wins: m.wins,

        losses: m.losses,

        winRate: Number(winRate.toFixed(2)),

        averageRR: Number(averageRR.toFixed(2)),

        averageWin: Number(averageWin.toFixed(2)),

        averageLoss: Number(averageLoss.toFixed(2)),

        averageTrade: Number(averageTrade.toFixed(2)),

        netPnL: Number(m.netPnL.toFixed(2)),

        profitFactor: Number(profitFactor.toFixed(2)),
      };

    })
    .sort((a, b) => a.netPnL - b.netPnL);
}