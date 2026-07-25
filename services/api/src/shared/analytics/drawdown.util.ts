type DrawdownTrade = {
  exitTime: Date | null;
  netPnl: number | null;
};

export function calculateDrawdown(
  trades: DrawdownTrade[]
) {
  let equity = 0;

  let peakEquity = 0;
  let peakDate: string | null = null;

  let maxDrawdown = 0;

  let currentDrawdown = 0;

  for (const trade of trades) {

    if (!trade.exitTime) continue;

    equity += trade.netPnl ?? 0;

    if (equity > peakEquity) {
      peakEquity = equity;
      peakDate = trade.exitTime.toISOString().split("T")[0];
    }

    const drawdown = equity - peakEquity;

    currentDrawdown = drawdown;

    if (drawdown < maxDrawdown) {
      maxDrawdown = drawdown;
    }
  }

  const drawdownPercent =
    peakEquity === 0
      ? 0
      : (maxDrawdown / peakEquity) * 100;

  return {
    currentEquity: Number(equity.toFixed(2)),

    peakEquity: Number(peakEquity.toFixed(2)),

    currentDrawdown: Number(currentDrawdown.toFixed(2)),

    maxDrawdown: Number(maxDrawdown.toFixed(2)),

    drawdownPercent: Number(drawdownPercent.toFixed(2)),

    peakDate,

    currentDate:
      trades.length > 0 && trades[trades.length - 1].exitTime
        ? trades[trades.length - 1].exitTime!
            .toISOString()
            .split("T")[0]
        : null,
  };
}