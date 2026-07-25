import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/api/query-keys";
import { tradeReviewApi } from "./api";

export function useTradeReview(tradeId: string) {
  return useQuery({
    queryKey: queryKeys.tradeReview.detail(tradeId),
    queryFn: () => tradeReviewApi.get(tradeId),
    enabled: Boolean(tradeId),
    staleTime: 5 * 60_000,
    retry: false,
  });
}
