import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys, type TradeListParams } from "@/lib/api/query-keys";
import { normalizeError } from "@/lib/api/normalize-error";
import { tradesApi } from "./api";
import type { CreateTradeInput, UpdateTradeInput } from "./types";

function useInvalidateTrades() {
  const queryClient = useQueryClient();

  return (id?: string) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.trades.all });
    queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.overview });
    queryClient.invalidateQueries({
      queryKey: queryKeys.dashboard.equityCurve,
    });

    if (id) {
      queryClient.invalidateQueries({ queryKey: queryKeys.trades.detail(id) });
    }
  };
}

export function useTrades(params: TradeListParams) {
  return useQuery({
    queryKey: queryKeys.trades.list(params),
    queryFn: () => tradesApi.list(params),
  });
}

export function useTradeSearch(query: string) {
  return useQuery({
    queryKey: queryKeys.trades.search(query),
    queryFn: () => tradesApi.search(query),
    enabled: query.trim().length > 0,
    staleTime: 30_000,
    meta: { silent: true },
  });
}

export function useTrade(id: string) {
  return useQuery({
    queryKey: queryKeys.trades.detail(id),
    queryFn: () => tradesApi.getOne(id),
    enabled: !!id,
  });
}

export function useTradeDetails(id: string) {
  return useQuery({
    queryKey: [...queryKeys.trades.detail(id), "full"] as const,
    queryFn: () => tradesApi.getDetails(id),
    enabled: !!id,
  });
}

export function useCreateTrade() {
  const invalidate = useInvalidateTrades();

  return useMutation({
    mutationFn: (payload: CreateTradeInput) => tradesApi.create(payload),
    onSuccess: () => {
      invalidate();
      toast.success("Trade created.");
    },
  });
}

export function useUpdateTrade(id: string) {
  const invalidate = useInvalidateTrades();

  return useMutation({
    mutationFn: (payload: UpdateTradeInput) => tradesApi.update(id, payload),
    onSuccess: () => {
      invalidate(id);
      toast.success("Trade updated.");
    },
    onError: (error) => toast.error(normalizeError(error)),
  });
}

export function useDeleteTrade() {
  const invalidate = useInvalidateTrades();

  return useMutation({
    mutationFn: (id: string) => tradesApi.remove(id),
    onSuccess: () => {
      invalidate();
      toast.success("Trade deleted.");
    },
    onError: (error) => toast.error(normalizeError(error)),
  });
}

export function useTradeJournal(id: string) {
  return useQuery({
    queryKey: queryKeys.trades.journal(id),
    queryFn: () => tradesApi.getJournal(id),
    enabled: !!id,
  });
}

export function useUpdateJournal(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Parameters<typeof tradesApi.updateJournal>[1]) =>
      tradesApi.updateJournal(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.trades.journal(id) });
      queryClient.invalidateQueries({
        queryKey: [...queryKeys.trades.detail(id), "full"],
      });
      toast.success("Journal saved.");
    },
    onError: (error) => toast.error(normalizeError(error)),
  });
}

export function useChecklist(id: string) {
  return useQuery({
    queryKey: queryKeys.trades.checklist(id),
    queryFn: () => tradesApi.getChecklist(id),
    enabled: !!id,
  });
}

export function useAddChecklistItem(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (title: string) => tradesApi.addChecklistItem(id, title),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.trades.checklist(id) }),
    onError: (error) => toast.error(normalizeError(error)),
  });
}

export function useUpdateChecklistItem(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      checklistId,
      ...payload
    }: {
      checklistId: string;
      title?: string;
      isChecked?: boolean;
    }) => tradesApi.updateChecklistItem(checklistId, payload),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.trades.checklist(id) }),
    onError: (error) => toast.error(normalizeError(error)),
  });
}

export function useDeleteChecklistItem(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (checklistId: string) =>
      tradesApi.deleteChecklistItem(checklistId),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.trades.checklist(id) }),
    onError: (error) => toast.error(normalizeError(error)),
  });
}

export function useTradeEmotions(id: string) {
  return useQuery({
    queryKey: queryKeys.trades.emotions(id),
    queryFn: () => tradesApi.getEmotions(id),
    enabled: !!id,
  });
}

export function useUpdateEmotions(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { emotionBefore?: string; emotionAfter?: string }) =>
      tradesApi.updateEmotions(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.trades.emotions(id) });
      queryClient.invalidateQueries({
        queryKey: [...queryKeys.trades.detail(id), "full"],
      });
      toast.success("Emotions saved.");
    },
    onError: (error) => toast.error(normalizeError(error)),
  });
}
