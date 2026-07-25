import { TradeStatus } from "../../generated/prisma/enums.js";
import type {
  CreateTradeInput,
  UpdateTradeInput,
} from "../../modules/trade/validations/trade.validation.js";

export function calculateTradeMetrics(
  data: CreateTradeInput | UpdateTradeInput
) {
  const quantity = data.quantity ?? 0;
  const entry = data.entryPrice ?? 0;
  const exit = data.exitPrice ?? entry;

  const status =
    data.exitPrice != null && data.exitTime != null
      ? TradeStatus.CLOSED
      : TradeStatus.OPEN;

  const brokerage = data.brokerage ?? 0;
  const taxes = data.taxes ?? 0;

  const grossPnl = (exit - entry) * quantity;

  const netPnl = grossPnl - brokerage - taxes;

  const riskAmount =
    data.stopLoss != null
      ? Math.abs(entry - data.stopLoss) * quantity
      : null;

  const rewardAmount =
    data.target != null
      ? Math.abs(data.target - entry) * quantity
      : null;

  const rrRatio =
    riskAmount && rewardAmount
      ? rewardAmount / riskAmount
      : null;

  return {
    status,
    grossPnl,
    netPnl,
    riskAmount,
    rewardAmount,
    rrRatio,
  };
}