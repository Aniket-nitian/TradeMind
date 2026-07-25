import { apiClient } from "@/lib/api/client";
import type { ApiResponse } from "@/lib/api/types";
import type { Strategy } from "@/features/trades/types";

export interface StrategyInput {
  name: string;
  description?: string;
  setupRules?: string;
  entryRules?: string;
  exitRules?: string;
  riskRules?: string;
  timeframe?: string;
  market?: string;
}

export const strategiesApi = {
  list: () =>
    apiClient
      .get<ApiResponse<Strategy[]>>("/strategies")
      .then((res) => res.data.data),

  create: (payload: StrategyInput) =>
    apiClient
      .post<ApiResponse<Strategy>>("/strategies", payload)
      .then((res) => res.data.data),

  update: (id: string, payload: Partial<StrategyInput>) =>
    apiClient
      .put<ApiResponse<Strategy>>(`/strategies/${id}`, payload)
      .then((res) => res.data.data),

  remove: (id: string) => apiClient.delete(`/strategies/${id}`),
};
