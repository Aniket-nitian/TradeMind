import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys, type ListParams } from "@/lib/api/query-keys";
import { normalizeError } from "@/lib/api/normalize-error";
import { subscriptionApi } from "./api";

export function useSubscriptionStatus() {
  return useQuery({
    queryKey: queryKeys.subscription.status,
    queryFn: subscriptionApi.status,
  });
}

export function useSubscribe() {
  return useMutation({
    mutationFn: subscriptionApi.subscribe,
    onError: (error) => toast.error(normalizeError(error)),
  });
}

export function useVerifySubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: subscriptionApi.verify,
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.subscription.status, data);
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.profile });
      toast.success("Payment verified — Premium is now active.");
    },
    onError: (error) => toast.error(normalizeError(error)),
  });
}

export function useSyncSubscriptionStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: subscriptionApi.sync,
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.subscription.status, data);
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.profile });
    },
    // Silent — this fires automatically on the return page; if it fails
    // (e.g. the mandate is still pending) the page's own "waiting" copy
    // already communicates that, no need for a toast on top.
  });
}

export function usePaymentHistory(params: ListParams) {
  return useQuery({
    queryKey: queryKeys.subscription.payments(params),
    queryFn: () => subscriptionApi.payments(params),
  });
}

export function useCancelSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: subscriptionApi.cancel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subscription.status });
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.profile });
      toast.success("Subscription cancelled.");
    },
    onError: (error) => toast.error(normalizeError(error)),
  });
}
