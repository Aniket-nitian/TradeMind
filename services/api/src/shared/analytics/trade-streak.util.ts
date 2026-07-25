type StreakTrade = {
  exitTime: Date | null;
  netPnl: number | null;
};

export function calculateTradeStreakAnalytics(
  trades: StreakTrade[]
) {
  let currentWinStreak = 0;
  let currentLossStreak = 0;

  let longestWinStreak = 0;
  let longestLossStreak = 0;

  let runningWin = 0;
  let runningLoss = 0;

  let totalWins = 0;
  let totalLosses = 0;

  for (const trade of trades) {
    const pnl = trade.netPnl ?? 0;

    if (pnl > 0) {
      totalWins++;

      runningWin++;
      runningLoss = 0;

      longestWinStreak = Math.max(
        longestWinStreak,
        runningWin
      );
    } else if (pnl < 0) {
      totalLosses++;

      runningLoss++;
      runningWin = 0;

      longestLossStreak = Math.max(
        longestLossStreak,
        runningLoss
      );
    }
  }

  for (let i = trades.length - 1; i >= 0; i--) {
    const pnl = trades[i].netPnl ?? 0;

    if (pnl > 0 && currentLossStreak === 0) {
      currentWinStreak++;
    } else if (pnl < 0 && currentWinStreak === 0) {
      currentLossStreak++;
    } else {
      break;
    }
  }

  return {
    totalWins,
    totalLosses,

    currentWinStreak,
    currentLossStreak,

    longestWinStreak,
    longestLossStreak,

    currentState:
      currentWinStreak > 0
        ? "WINNING"
        : currentLossStreak > 0
        ? "LOSING"
        : "NEUTRAL",
  };
}