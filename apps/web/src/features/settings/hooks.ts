import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/lib/api/query-keys";
import { normalizeError } from "@/lib/api/normalize-error";
import { settingsApi } from "./api";

export function useSettings() {
  return useQuery({
    queryKey: queryKeys.settings.root,
    queryFn: settingsApi.get,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: settingsApi.updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.settings.root });
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.profile });
      toast.success("Profile updated.");
    },
    onError: (error) => toast.error(normalizeError(error)),
  });
}

export function useUploadAvatar() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: settingsApi.uploadAvatar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.settings.root });
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.profile });
      toast.success("Avatar updated.");
    },
    onError: (error) => toast.error(normalizeError(error)),
  });
}

export function useUpdateTradingPreferences() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: settingsApi.updateTradingPreferences,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.settings.root });
      toast.success("Trading preferences saved.");
    },
    onError: (error) => toast.error(normalizeError(error)),
  });
}

export function useUpdateBrokerPreferences() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: settingsApi.updateBrokerPreferences,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.settings.root });
      toast.success("Broker preferences saved.");
    },
    onError: (error) => toast.error(normalizeError(error)),
  });
}

export function useUpdateNotificationPreferences() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: settingsApi.updateNotificationPreferences,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.settings.root });
      toast.success("Notification preferences saved.");
    },
    onError: (error) => toast.error(normalizeError(error)),
  });
}

export function useSessions() {
  return useQuery({
    queryKey: queryKeys.settings.sessions,
    queryFn: settingsApi.listSessions,
  });
}

export function useRevokeSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => settingsApi.revokeSession(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.settings.sessions });
      toast.success("Session revoked.");
    },
    onError: (error) => toast.error(normalizeError(error)),
  });
}

export function useDeactivateAccount() {
  return useMutation({
    mutationFn: (password: string) => settingsApi.deactivateAccount(password),
    onError: (error) => toast.error(normalizeError(error)),
  });
}
