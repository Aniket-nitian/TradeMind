import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/api/query-keys";
import { strategyAdvisorApi } from "./api";

export function useStrategyAdvisor() {
  return useQuery({
    queryKey: queryKeys.strategyAdvisor.root,
    queryFn: strategyAdvisorApi.get,
    staleTime: 5 * 60_000,
    retry: false,
  });
}
