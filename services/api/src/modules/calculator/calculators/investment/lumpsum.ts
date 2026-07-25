import { LumpsumDto } from "../../dto/investment.dto.js";

export function calculateLumpsum(
  input: LumpsumDto
) {

  const rate =
    input.annualReturn / 100;

  const maturityAmount =
    input.principal *
    Math.pow(
      1 + rate,
      input.years
    );

  return {

    investedAmount: input.principal,

    maturityAmount: Number(
      maturityAmount.toFixed(2)
    ),

    wealthGained: Number(
      (
        maturityAmount -
        input.principal
      ).toFixed(2)
    )

  };

}