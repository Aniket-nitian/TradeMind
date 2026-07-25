import { RiskRewardDto } from "../../dto/calculator.dto.js";

export function calculateRiskReward(
  input: RiskRewardDto
) {
  const risk =
    Math.abs(
      input.entryPrice - input.stopLoss
    );

  const reward =
    Math.abs(
      input.targetPrice - input.entryPrice
    );

  if (risk === 0) {
    throw new Error(
      "Risk cannot be zero."
    );
  }

  const ratio =
    reward / risk;

  return {
    risk: Number(
      risk.toFixed(2)
    ),

    reward: Number(
      reward.toFixed(2)
    ),

    ratio: Number(
      ratio.toFixed(2)
    ),
  };
}