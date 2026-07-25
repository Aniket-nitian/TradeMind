import { PositionSizeDto } from "../../dto/calculator.dto.js";

export function calculatePositionSize(
  input: PositionSizeDto
) {
  const riskAmount =
    (input.accountSize * input.riskPercent) / 100;

  const stopLossDistance =
    Math.abs(
      input.entryPrice - input.stopLoss
    );

  if (stopLossDistance === 0) {
    throw new Error(
      "Entry price and Stop Loss cannot be the same."
    );
  }

  const quantity =
    Math.floor(
      riskAmount / stopLossDistance
    );

  const positionValue =
    quantity * input.entryPrice;

  return {
    riskAmount: Number(
      riskAmount.toFixed(2)
    ),

    stopLossDistance: Number(
      stopLossDistance.toFixed(2)
    ),

    quantity,

    positionValue: Number(
      positionValue.toFixed(2)
    ),
  };
}