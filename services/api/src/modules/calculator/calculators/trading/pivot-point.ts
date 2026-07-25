import { PivotPointDto } from "../../dto/technical.dto.js";

export function calculatePivotPoint(
  input: PivotPointDto
) {

  const pivot =
    (input.high + input.low + input.close) / 3;

  const resistance1 =
    (2 * pivot) - input.low;

  const support1 =
    (2 * pivot) - input.high;

  const resistance2 =
    pivot + (input.high - input.low);

  const support2 =
    pivot - (input.high - input.low);

  return {

    pivot: Number(
      pivot.toFixed(2)
    ),

    resistance1: Number(
      resistance1.toFixed(2)
    ),

    support1: Number(
      support1.toFixed(2)
    ),

    resistance2: Number(
      resistance2.toFixed(2)
    ),

    support2: Number(
      support2.toFixed(2)
    )

  };

}