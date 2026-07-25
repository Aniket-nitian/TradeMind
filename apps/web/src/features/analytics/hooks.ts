import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/api/query-keys";
import { analyticsApi } from "./api";

export function useWinLoss() {
  return useQuery({ queryKey: queryKeys.analytics.winLoss, queryFn: analyticsApi.winLoss });
}

export function useStrategyAnalytics() {
  return useQuery({
    queryKey: queryKeys.analytics.strategies,
    queryFn: analyticsApi.strategies,
  });
}

export function useBrokerAnalytics() {
  return useQuery({
    queryKey: queryKeys.analytics.brokers,
    queryFn: analyticsApi.brokers,
  });
}

export function usePsychologyAnalytics() {
  return useQuery({
    queryKey: queryKeys.analytics.psychology,
    queryFn: analyticsApi.psychology,
  });
}

export function useCalendarHeatmap() {
  return useQuery({ queryKey: queryKeys.analytics.calendar, queryFn: analyticsApi.calendar });
}

export function useDrawdown() {
  return useQuery({ queryKey: queryKeys.analytics.drawdown, queryFn: analyticsApi.drawdown });
}

export function useConfidenceAnalytics() {
  return useQuery({
    queryKey: queryKeys.analytics.confidence,
    queryFn: analyticsApi.confidence,
  });
}
