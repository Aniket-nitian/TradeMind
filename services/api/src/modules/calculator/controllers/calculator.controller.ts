import type { Request, Response } from "express";

import { ApiResponse } from "../../../shared/response/api-response.js";

import { calculatorService } from "../services/calculator.service.js";

import {
  positionSizeSchema,
  riskRewardSchema,
  stockAverageSchema,
  brokerageSchema,
} from "../validations/calculator.validation.js";

import {
  cagrSchema,
  lumpsumSchema,
  sipSchema,
  goalCalculatorSchema,
} from "../validations/investment.validation.js";
import { fibonacciSchema, pivotPointSchema } from "../validations/technical.validation.js";
import { marginCalculatorSchema } from "../validations/margin.validation.js";

export class CalculatorController {

  positionSize(req: Request, res: Response) {
  console.log(req.body);

  const data = positionSizeSchema.parse(req.body);

  console.log(data);

  const result = calculatorService.positionSize(data);

  console.log(result);

  return new ApiResponse(
    true,
    "Position size calculated successfully.",
    result
  ).send(res);
}

  riskReward(req: Request, res: Response) {

    const data =
      riskRewardSchema.parse(req.body);

    const result =
      calculatorService.riskReward(data);

    return new ApiResponse(
      true,
      "Risk Reward calculated successfully.",
      result
    ).send(res);
  }

  stockAverage(req: Request, res: Response) {

    const data =
      stockAverageSchema.parse(req.body);

    const result =
      calculatorService.stockAverage(data);

    return new ApiResponse(
      true,
      "Average price calculated successfully.",
      result
    ).send(res);
  }

  brokerage(req: Request, res: Response) {

    const data =
      brokerageSchema.parse(req.body);

    const result =
      calculatorService.brokerage(data);

    return new ApiResponse(
      true,
      "Brokerage calculated successfully.",
      result
    ).send(res);
  }

  margin(req: Request, res: Response) {

  const data =
    marginCalculatorSchema.parse(req.body);

  const result =
    calculatorService.margin(data);

  return new ApiResponse(
    true,
    "Margin calculated successfully.",
    result
  ).send(res);

}

pivotPoint(req: Request, res: Response) {

  const data =
    pivotPointSchema.parse(req.body);

  const result =
    calculatorService.pivotPoint(data);

  return new ApiResponse(
    true,
    "Pivot Point calculated successfully.",
    result
  ).send(res);

}

fibonacci(req: Request, res: Response) {

  const data =
    fibonacciSchema.parse(req.body);

  const result =
    calculatorService.fibonacci(data);

  return new ApiResponse(
    true,
    "Fibonacci levels calculated successfully.",
    result
  ).send(res);

}

cagr(req: Request, res: Response) {

  const data =
    cagrSchema.parse(req.body);

  const result =
    calculatorService.cagr(data);

  return new ApiResponse(
    true,
    "CAGR calculated successfully.",
    result
  ).send(res);

}

lumpsum(req: Request, res: Response) {

  const data =
    lumpsumSchema.parse(req.body);

  const result =
    calculatorService.lumpsum(data);

  return new ApiResponse(
    true,
    "Lumpsum calculated successfully.",
    result
  ).send(res);

}

sip(req: Request, res: Response) {

  const data =
    sipSchema.parse(req.body);

  const result =
    calculatorService.sip(data);

  return new ApiResponse(
    true,
    "SIP calculated successfully.",
    result
  ).send(res);

}

goal(req: Request, res: Response) {

  const data =
    goalCalculatorSchema.parse(req.body);

  const result =
    calculatorService.goal(data);

  return new ApiResponse(
    true,
    "Goal investment calculated successfully.",
    result
  ).send(res);

}

}

export const calculatorController =
  new CalculatorController();