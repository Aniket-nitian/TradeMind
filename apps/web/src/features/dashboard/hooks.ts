import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/api/query-keys";
import { dashboardApi } from "./api";

export function useDashboardOverview() {
  return useQuery({
    queryKey: queryKeys.dashboard.overview,
    queryFn: dashboardApi.overview,
  });
}

export function useEquityCurve() {
  return useQuery({
    queryKey: queryKeys.dashboard.equityCurve,
    queryFn: dashboardApi.equityCurve,
  });
}
