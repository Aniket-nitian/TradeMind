import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/api/query-keys";
import { marketApi } from "./api";

export function useMarketIndices() {
  return useQuery({
    queryKey: queryKeys.market.indices,
    queryFn: marketApi.indices,
    staleTime: 45_000,
    refetchInterval: 60_000,
    retry: 1,
    meta: { silent: true },
  });
}
