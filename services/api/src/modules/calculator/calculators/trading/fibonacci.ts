import { FibonacciDto } from "../../dto/technical.dto.js";

export function calculateFibonacci(
  input: FibonacciDto
) {

  const range =
    input.high - input.low;

  return {

    high: input.high,

    low: input.low,

    levels: {

      "23.6%": Number(
        (input.high - range * 0.236).toFixed(2)
      ),

      "38.2%": Number(
        (input.high - range * 0.382).toFixed(2)
      ),

      "50%": Number(
        (input.high - range * 0.5).toFixed(2)
      ),

      "61.8%": Number(
        (input.high - range * 0.618).toFixed(2)
      ),

      "78.6%": Number(
        (input.high - range * 0.786).toFixed(2)
      )

    }

  };

}