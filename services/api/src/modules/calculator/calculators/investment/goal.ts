import { GoalCalculatorDto } from "../../dto/investment.dto.js";

export function calculateGoalInvestment(
  input: GoalCalculatorDto
) {

  const monthlyRate =
    input.annualReturn / 12 / 100;

  const months =
    input.years * 12;

  const monthlyInvestment =
    input.targetAmount /
    (
      (
        Math.pow(
          1 + monthlyRate,
          months
        ) - 1
      ) /
      monthlyRate
    ) /
    (1 + monthlyRate);

  return {

    monthlyInvestment: Number(
      monthlyInvestment.toFixed(2)
    ),

    targetAmount:
      input.targetAmount

  };

}