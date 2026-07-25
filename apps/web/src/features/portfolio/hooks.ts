import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { normalizeError } from "@/lib/api/normalize-error";
import { queryKeys, type ListParams } from "@/lib/api/query-keys";
import { portfolioApi } from "./api";
import type { RecordCapitalInput } from "./types";

function useInvalidatePortfolio() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.portfolio.value });
    queryClient.invalidateQueries({ queryKey: queryKeys.portfolio.holdings });
    queryClient.invalidateQueries({ queryKey: queryKeys.portfolio.analytics });
  };
}

export function usePortfolioValue() {
  return useQuery({
    queryKey: queryKeys.portfolio.value,
    queryFn: portfolioApi.value,
  });
}

export function useHoldings() {
  return useQuery({
    queryKey: queryKeys.portfolio.holdings,
    queryFn: portfolioApi.holdings,
  });
}

export function usePortfolioAnalytics() {
  return useQuery({
    queryKey: queryKeys.portfolio.analytics,
    queryFn: portfolioApi.analytics,
  });
}

export function useCapitalHistory(params: ListParams) {
  return useQuery({
    queryKey: queryKeys.portfolio.capitalList(params),
    queryFn: () => portfolioApi.capitalHistory(params),
  });
}

export function useRecordCapital() {
  const invalidate = useInvalidatePortfolio();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: RecordCapitalInput) => portfolioApi.recordCapital(payload),
    onSuccess: () => {
      invalidate();
      queryClient.invalidateQueries({ queryKey: queryKeys.portfolio.capitalAll });
      toast.success("Transaction recorded.");
    },
    onError: (error) => toast.error(normalizeError(error)),
  });
}

export function useDeleteCapitalTransaction() {
  const invalidate = useInvalidatePortfolio();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => portfolioApi.deleteCapitalTransaction(id),
    onSuccess: () => {
      invalidate();
      queryClient.invalidateQueries({ queryKey: queryKeys.portfolio.capitalAll });
      toast.success("Transaction deleted.");
    },
    onError: (error) => toast.error(normalizeError(error)),
  });
}

export function useSnapshotHistory(params: ListParams) {
  return useQuery({
    queryKey: queryKeys.portfolio.snapshotList(params),
    queryFn: () => portfolioApi.snapshotHistory(params),
  });
}

export function useCreateSnapshot() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => portfolioApi.createSnapshot(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.portfolio.snapshotAll });
      toast.success("Snapshot saved.");
    },
    onError: (error) => toast.error(normalizeError(error)),
  });
}
