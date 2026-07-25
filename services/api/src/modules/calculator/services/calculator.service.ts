import {
  PositionSizeDto,
  RiskRewardDto,
  StockAverageDto,
  BrokerageDto,
} from "../dto/calculator.dto.js";

import {
  CAGRDto,
  LumpsumDto,
  SIPDto,
  GoalCalculatorDto,
} from "../dto/investment.dto.js";

import { calculateCAGR } from "../calculators/investment/cagr.js";
import { calculateLumpsum } from "../calculators/investment/lumpsum.js";
import { calculateSIP } from "../calculators/investment/sip.js";
import { calculateGoalInvestment } from "../calculators/investment/goal.js";

import { calculatePositionSize } from "../calculators/trading/position-size.js";
import { calculateRiskReward } from "../calculators/trading/risk-reward.js";
import { calculateStockAverage } from "../calculators/trading/stock-average.js";
import { calculateBrokerage } from "../calculators/trading/brokerage.js";
import { calculateFibonacci } from "../calculators/trading/fibonacci.js";
import { calculatePivotPoint } from "../calculators/trading/pivot-point.js";
import { FibonacciDto, PivotPointDto } from "../dto/technical.dto.js";
import { calculateMargin } from "../calculators/trading/margin.js";
import { MarginCalculatorDto } from "../dto/margin.dto.js";

export class CalculatorService {
  positionSize(data: PositionSizeDto) {
    return calculatePositionSize(data);
  }

  riskReward(data: RiskRewardDto) {
    return calculateRiskReward(data);
  }

  stockAverage(data: StockAverageDto) {
    return calculateStockAverage(data);
  }

  brokerage(data: BrokerageDto) {
    return calculateBrokerage(data);
  }

  margin(
    data: MarginCalculatorDto
  ) {
    return calculateMargin(data);
  }

  pivotPoint(
    data: PivotPointDto
  ) {
    return calculatePivotPoint(data);
  }

  fibonacci(
    data: FibonacciDto
  ) {
    return calculateFibonacci(data);
  }

  cagr(data: CAGRDto) {
  return calculateCAGR(data);
}

lumpsum(data: LumpsumDto) {
  return calculateLumpsum(data);
}

sip(data: SIPDto) {
  return calculateSIP(data);
}

goal(data: GoalCalculatorDto) {
  return calculateGoalInvestment(data);
}
}

export const calculatorService =
  new CalculatorService();