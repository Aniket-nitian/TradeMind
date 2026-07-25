import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys, type ListParams } from "@/lib/api/query-keys";
import { notificationsApi } from "./api";

export function useNotifications() {
  return useQuery({
    queryKey: queryKeys.notifications.list({ limit: 10 }),
    queryFn: () => notificationsApi.list({ limit: 10 }),
    refetchInterval: 60_000,
    meta: { silent: true },
  });
}

export function useNotificationsList(params: ListParams) {
  return useQuery({
    queryKey: queryKeys.notifications.list(params),
    queryFn: () => notificationsApi.list(params),
  });
}

function useInvalidateNotifications() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
}

export function useMarkNotificationRead() {
  const invalidate = useInvalidateNotifications();
  return useMutation({
    mutationFn: (id: string) => notificationsApi.markAsRead(id),
    onSuccess: invalidate,
  });
}

export function useMarkAllNotificationsRead() {
  const invalidate = useInvalidateNotifications();
  return useMutation({
    mutationFn: () => notificationsApi.markAllAsRead(),
    onSuccess: invalidate,
  });
}

export function useDeleteNotification() {
  const invalidate = useInvalidateNotifications();
  return useMutation({
    mutationFn: (id: string) => notificationsApi.remove(id),
    onSuccess: invalidate,
  });
}
