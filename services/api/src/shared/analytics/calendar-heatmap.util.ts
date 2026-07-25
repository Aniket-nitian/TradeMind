type CalendarTrade = {
  exitTime: Date | null;
  netPnl: number | null;
};

export function calculateCalendarHeatmap(
  trades: CalendarTrade[]
) {
  const calendar = new Map<
    string,
    {
      date: string;
      trades: number;
      wins: number;
      losses: number;
      netPnL: number;
    }
  >();

  for (const trade of trades) {

    if (!trade.exitTime) continue;

    const date =
      trade.exitTime.toISOString().split("T")[0];

    let day = calendar.get(date);

    if (!day) {
      day = {
        date,
        trades: 0,
        wins: 0,
        losses: 0,
        netPnL: 0,
      };

      calendar.set(date, day);
    }

    const pnl = trade.netPnl ?? 0;

    day.trades++;
    day.netPnL += pnl;

    if (pnl > 0) {
      day.wins++;
    } else if (pnl < 0) {
      day.losses++;
    }
  }

  return Array.from(calendar.values()).sort(
    (a, b) => a.date.localeCompare(b.date)
  );
}