import { SIPDto } from "../../dto/investment.dto.js";

export function calculateSIP(
  input: SIPDto
) {

  const monthlyRate =
    input.annualReturn / 12 / 100;

  const months =
    input.years * 12;

  const maturityAmount =
    input.monthlyInvestment *
    (
      (
        Math.pow(
          1 + monthlyRate,
          months
        ) - 1
      ) /
      monthlyRate
    ) *
    (1 + monthlyRate);

  return {

    investedAmount:
      input.monthlyInvestment *
      months,

    maturityAmount: Number(
      maturityAmount.toFixed(2)
    ),

    wealthGained: Number(
      (
        maturityAmount -
        input.monthlyInvestment * months
      ).toFixed(2)
    )

  };

}