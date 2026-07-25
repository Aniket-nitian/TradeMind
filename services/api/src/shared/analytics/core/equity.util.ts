type EquityTrade = {
  exitTime: Date | null;
  netPnl: number | null;
};

export function buildEquitySeries(trades: EquityTrade[]) {
  let equity = 0;

  return trades
    .filter((trade) => trade.exitTime)
    .map((trade) => {
      equity += trade.netPnl ?? 0;

      return {
        date: trade.exitTime!.toISOString().split("T")[0],
        equity: Number(equity.toFixed(2)),
      };
    });
}