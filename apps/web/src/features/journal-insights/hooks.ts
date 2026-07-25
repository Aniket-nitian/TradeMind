import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/api/query-keys";
import { journalInsightsApi } from "./api";

export function useJournalInsights() {
  return useQuery({
    queryKey: queryKeys.journalInsights.root,
    queryFn: journalInsightsApi.get,
    staleTime: 5 * 60_000,
    retry: false,
  });
}
