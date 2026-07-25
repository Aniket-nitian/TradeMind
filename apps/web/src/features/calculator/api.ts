import { apiClient } from "@/lib/api/client";
import type { ApiResponse } from "@/lib/api/types";
import type {
  PositionSizeRequest,
  PositionSizeResult,
  RiskRewardRequest,
  RiskRewardResult,
  StockAverageRequest,
  StockAverageResult,
  BrokerageRequest,
  BrokerageResult,
  MarginRequest,
  MarginResult,
  PivotPointRequest,
  PivotPointResult,
  FibonacciRequest,
  FibonacciResult,
  CagrRequest,
  CagrResult,
  LumpsumRequest,
  LumpsumResult,
  SipRequest,
  SipResult,
  GoalRequest,
  GoalResult,
} from "./types";

export const calculatorApi = {
  positionSize: (data: PositionSizeRequest) =>
    apiClient
      .post<ApiResponse<PositionSizeResult>>("/calculator/position-size", data)
      .then((res) => res.data.data),

  riskReward: (data: RiskRewardRequest) =>
    apiClient
      .post<ApiResponse<RiskRewardResult>>("/calculator/risk-reward", data)
      .then((res) => res.data.data),

  stockAverage: (data: StockAverageRequest) =>
    apiClient
      .post<ApiResponse<StockAverageResult>>("/calculator/stock-average", data)
      .then((res) => res.data.data),

  brokerage: (data: BrokerageRequest) =>
    apiClient
      .post<ApiResponse<BrokerageResult>>("/calculator/brokerage", data)
      .then((res) => res.data.data),

  margin: (data: MarginRequest) =>
    apiClient
      .post<ApiResponse<MarginResult>>("/calculator/margin", data)
      .then((res) => res.data.data),

  pivotPoint: (data: PivotPointRequest) =>
    apiClient
      .post<ApiResponse<PivotPointResult>>("/calculator/pivot-point", data)
      .then((res) => res.data.data),

  fibonacci: (data: FibonacciRequest) =>
    apiClient
      .post<ApiResponse<FibonacciResult>>("/calculator/fibonacci", data)
      .then((res) => res.data.data),

  cagr: (data: CagrRequest) =>
    apiClient
      .post<ApiResponse<CagrResult>>("/calculator/cagr", data)
      .then((res) => res.data.data),

  lumpsum: (data: LumpsumRequest) =>
    apiClient
      .post<ApiResponse<LumpsumResult>>("/calculator/lumpsum", data)
      .then((res) => res.data.data),

  sip: (data: SipRequest) =>
    apiClient
      .post<ApiResponse<SipResult>>("/calculator/sip", data)
      .then((res) => res.data.data),

  goal: (data: GoalRequest) =>
    apiClient
      .post<ApiResponse<GoalResult>>("/calculator/goal", data)
      .then((res) => res.data.data),
};
