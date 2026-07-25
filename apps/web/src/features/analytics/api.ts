import { apiClient } from "@/lib/api/client";
import type { ApiResponse } from "@/lib/api/types";
import type {
  BrokerPerformance,
  CalendarDay,
  ConfidenceBucket,
  DrawdownStats,
  PsychologyPerformance,
  StrategyPerformance,
  WinLossDistribution,
} from "./types";

export const analyticsApi = {
  winLoss: () =>
    apiClient
      .get<ApiResponse<WinLossDistribution>>("/dashboard/win-loss")
      .then((res) => res.data.data),

  strategies: () =>
    apiClient
      .get<ApiResponse<StrategyPerformance[]>>("/dashboard/strategies")
      .then((res) => res.data.data),

  brokers: () =>
    apiClient
      .get<ApiResponse<BrokerPerformance[]>>("/dashboard/brokers")
      .then((res) => res.data.data),

  psychology: () =>
    apiClient
      .get<ApiResponse<PsychologyPerformance[]>>("/dashboard/psychology")
      .then((res) => res.data.data),

  calendar: () =>
    apiClient
      .get<ApiResponse<CalendarDay[]>>("/dashboard/calendar")
      .then((res) => res.data.data),

  drawdown: () =>
    apiClient
      .get<ApiResponse<DrawdownStats>>("/dashboard/drawdown")
      .then((res) => res.data.data),

  confidence: () =>
    apiClient
      .get<ApiResponse<ConfidenceBucket[]>>("/dashboard/confidence")
      .then((res) => res.data.data),
};
