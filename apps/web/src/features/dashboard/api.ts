import { apiClient } from "@/lib/api/client";
import type { ApiResponse } from "@/lib/api/types";
import type { DashboardOverview, EquityPoint } from "./types";

export const dashboardApi = {
  overview: () =>
    apiClient
      .get<ApiResponse<DashboardOverview>>("/dashboard/overview")
      .then((res) => res.data.data),

  equityCurve: () =>
    apiClient
      .get<ApiResponse<EquityPoint[]>>("/dashboard/equity-curve")
      .then((res) => res.data.data),
};
