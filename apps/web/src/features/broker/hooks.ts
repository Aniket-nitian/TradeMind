import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys, type ListParams } from "@/lib/api/query-keys";
import { normalizeError } from "@/lib/api/normalize-error";
import { brokerApi } from "./api";
import type { Broker } from "./types";

export function useBrokerAccounts() {
  return useQuery({
    queryKey: queryKeys.broker.accounts,
    queryFn: brokerApi.list,
  });
}

export function useConnectBroker() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: brokerApi.connect,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.broker.accounts });
      toast.success("Broker connected.");
    },
    onError: (error) => toast.error(normalizeError(error)),
  });
}

export function useDisconnectBroker() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (broker: Broker) => brokerApi.disconnect(broker),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.broker.accounts });
      toast.success("Broker disconnected.");
    },
    onError: (error) => toast.error(normalizeError(error)),
  });
}

export function useSyncHistory(params: ListParams) {
  return useQuery({
    queryKey: queryKeys.broker.syncHistory(params),
    queryFn: () => brokerApi.syncHistory(params),
  });
}

export function useSyncBroker() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (broker: Broker) => brokerApi.sync(broker),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.broker.accounts });
      queryClient.invalidateQueries({ queryKey: queryKeys.broker.syncHistoryAll });
      queryClient.invalidateQueries({ queryKey: queryKeys.trades.all });
      toast.success(`Sync ${result.status.toLowerCase()}: ${result.importedRows} trades imported.`);
    },
    onError: (error) => toast.error(normalizeError(error)),
  });
}
