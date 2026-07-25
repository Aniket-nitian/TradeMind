import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/api/query-keys";
import { dailyBriefApi } from "./api";

export function useDailyBrief() {
  return useQuery({
    queryKey: queryKeys.dailyBrief.root,
    queryFn: dailyBriefApi.get,
    staleTime: 5 * 60_000,
    retry: false,
  });
}
