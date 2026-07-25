import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/api/query-keys";
import { newsApi } from "./api";

export function useNews() {
  return useQuery({
    queryKey: queryKeys.news.root,
    queryFn: newsApi.get,
    staleTime: 10 * 60_000,
    retry: false,
    meta: { silent: true },
  });
}

export function useMarketNews() {
  return useQuery({
    queryKey: queryKeys.news.market,
    queryFn: newsApi.getMarket,
    staleTime: 10 * 60_000,
    refetchInterval: 10 * 60_000,
    retry: false,
    meta: { silent: true },
  });
}
