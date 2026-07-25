import { CAGRDto } from "../../dto/investment.dto.js";

export function calculateCAGR(
  input: CAGRDto
) {
  const cagr =
    (
      Math.pow(
        input.finalValue / input.initialValue,
        1 / input.years
      ) - 1
    ) * 100;

  return {
    cagr: Number(cagr.toFixed(2))
  };
}