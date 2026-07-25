export interface TradeCalculationInput {
  side: "BUY" | "SELL";

  quantity: number;

  entryPrice: number;

  exitPrice?: number;

  stopLoss?: number;

  target?: number;

  brokerage?: number;

  taxes?: number;
}

export interface TradeCalculationResult {
  grossPnl: number | null;

  netPnl: number | null;

  riskAmount: number | null;

  rewardAmount: number | null;

  rrRatio: number | null;
}

export function calculateTrade(
  trade: TradeCalculationInput
): TradeCalculationResult {
  const {
    side,
    quantity,
    entryPrice,
    exitPrice,
    stopLoss,
    target,
    brokerage = 0,
    taxes = 0,
  } = trade;

  let grossPnl: number | null = null;

  if (exitPrice !== undefined) {
    grossPnl =
      side === "BUY"
        ? (exitPrice - entryPrice) * quantity
        : (entryPrice - exitPrice) * quantity;
  }

  const netPnl =
    grossPnl === null
      ? null
      : grossPnl - brokerage - taxes;

  const riskAmount =
    stopLoss === undefined
      ? null
      : Math.abs(entryPrice - stopLoss) * quantity;

  const rewardAmount =
    target === undefined
      ? null
      : Math.abs(target - entryPrice) * quantity;

  const rrRatio =
    riskAmount && rewardAmount
      ? Number((rewardAmount / riskAmount).toFixed(2))
      : null;

  return {
    grossPnl,
    netPnl,
    riskAmount,
    rewardAmount,
    rrRatio,
  };
}