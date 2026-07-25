export function calculateWinRate(
  wins: number,
  totalTrades: number
): number {
  if (totalTrades === 0) return 0;

  return Number(((wins / totalTrades) * 100).toFixed(2));
}

export function calculateAverageRR(
  totalRR: number,
  totalTrades: number
): number {
  if (totalTrades === 0) return 0;

  return Number((totalRR / totalTrades).toFixed(2));
}

export function calculateAverageTrade(
  netPnL: number,
  totalTrades: number
): number {
  if (totalTrades === 0) return 0;

  return Number((netPnL / totalTrades).toFixed(2));
}

export function calculateAverageWin(
  grossProfit: number,
  wins: number
): number {
  if (wins === 0) return 0;

  return Number((grossProfit / wins).toFixed(2));
}

export function calculateAverageLoss(
  grossLoss: number,
  losses: number
): number {
  if (losses === 0) return 0;

  return Number((grossLoss / losses).toFixed(2));
}

export function calculateProfitFactor(
  grossProfit: number,
  grossLoss: number
): number {
  if (grossLoss === 0) return 0;

  return Number((grossProfit / Math.abs(grossLoss)).toFixed(2));
}