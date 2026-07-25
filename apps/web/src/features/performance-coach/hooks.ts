import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/api/query-keys";
import { performanceCoachApi } from "./api";

export function usePerformanceCoach() {
  return useQuery({
    queryKey: queryKeys.performanceCoach.root,
    queryFn: performanceCoachApi.get,
    staleTime: 5 * 60_000,
    retry: false,
    meta: { silent: true },
  });
}
