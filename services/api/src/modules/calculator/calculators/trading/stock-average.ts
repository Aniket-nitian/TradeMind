import { StockAverageDto } from "../../dto/calculator.dto.js";

export function calculateStockAverage(
  input: StockAverageDto
) {
  const totalQuantity =
    input.firstQuantity +
    input.secondQuantity;

  const totalInvestment =
    input.firstQuantity * input.firstPrice +
    input.secondQuantity * input.secondPrice;

  const averagePrice =
    totalInvestment / totalQuantity;

  return {
    totalQuantity,

    totalInvestment: Number(
      totalInvestment.toFixed(2)
    ),

    averagePrice: Number(
      averagePrice.toFixed(2)
    ),
  };
}