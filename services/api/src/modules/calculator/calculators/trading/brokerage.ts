import { BrokerageDto } from "../../dto/calculator.dto.js";

export function calculateBrokerage(
  input: BrokerageDto
) {
  const buyValue =
    input.buyPrice * input.quantity;

  const sellValue =
    input.sellPrice * input.quantity;

  const turnover =
    buyValue + sellValue;

  const brokerage =
    input.brokeragePerOrder * 2;

  const grossPnL =
    sellValue - buyValue;

  const netPnL =
    grossPnL - brokerage;

  return {
    turnover: Number(
      turnover.toFixed(2)
    ),

    brokerage: Number(
      brokerage.toFixed(2)
    ),

    grossPnL: Number(
      grossPnL.toFixed(2)
    ),

    netPnL: Number(
      netPnL.toFixed(2)
    ),
  };
}