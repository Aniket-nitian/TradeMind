import { MarginCalculatorDto } from "../../dto/margin.dto.js";

export function calculateMargin(
  input: MarginCalculatorDto
) {

  const buyingPower =
    input.capital * input.leverage;

  const quantity =
    Math.floor(
      buyingPower / input.entryPrice
    );

  const marginUsed =
    quantity * input.entryPrice;

  const unusedBuyingPower =
    buyingPower - marginUsed;

  return {

    capital: Number(
      input.capital.toFixed(2)
    ),

    leverage: input.leverage,

    buyingPower: Number(
      buyingPower.toFixed(2)
    ),

    quantity,

    marginUsed: Number(
      marginUsed.toFixed(2)
    ),

    unusedBuyingPower: Number(
      unusedBuyingPower.toFixed(2)
    )

  };

}