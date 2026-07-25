import { apiClient } from "@/lib/api/client";
import type { ApiResponse } from "@/lib/api/types";
import type {
  CapitalHistoryResult,
  CapitalTransaction,
  Holding,
  PortfolioAnalytics,
  PortfolioSnapshot,
  PortfolioValue,
  RecordCapitalInput,
  SnapshotHistoryResult,
} from "./types";

export const portfolioApi = {
  value: () =>
    apiClient
      .get<ApiResponse<PortfolioValue>>("/portfolio/value")
      .then((res) => res.data.data),

  holdings: () =>
    apiClient
      .get<ApiResponse<Holding[]>>("/portfolio/holdings")
      .then((res) => res.data.data),

  recordCapital: (payload: RecordCapitalInput) =>
    apiClient
      .post<ApiResponse<CapitalTransaction>>("/portfolio/capital", payload)
      .then((res) => res.data.data),

  capitalHistory: (params: { page?: number; limit?: number }) =>
    apiClient
      .get<ApiResponse<CapitalHistoryResult>>("/portfolio/capital", { params })
      .then((res) => res.data.data),

  deleteCapitalTransaction: (id: string) =>
    apiClient.delete(`/portfolio/capital/${id}`),

  createSnapshot: () =>
    apiClient
      .post<ApiResponse<PortfolioSnapshot>>("/portfolio/snapshot")
      .then((res) => res.data.data),

  snapshotHistory: (params: { page?: number; limit?: number }) =>
    apiClient
      .get<ApiResponse<SnapshotHistoryResult>>("/portfolio/snapshots", { params })
      .then((res) => res.data.data),

  analytics: () =>
    apiClient
      .get<ApiResponse<PortfolioAnalytics>>("/portfolio/analytics")
      .then((res) => res.data.data),
};
