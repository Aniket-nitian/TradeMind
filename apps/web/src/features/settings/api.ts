import { apiClient } from "@/lib/api/client";
import type { ApiResponse } from "@/lib/api/types";
import type { Broker } from "@/features/broker/types";
import type { SessionInfo, SettingsResponse, UserProfile } from "./types";

export const settingsApi = {
  get: () =>
    apiClient.get<ApiResponse<SettingsResponse>>("/settings").then((res) => res.data.data),

  updateProfile: (payload: Partial<UserProfile>) =>
    apiClient
      .put<ApiResponse<UserProfile>>("/users/profile", payload)
      .then((res) => res.data.data),

  uploadAvatar: (file: File) => {
    const formData = new FormData();
    formData.append("avatar", file);

    return apiClient
      .post<ApiResponse<UserProfile>>("/users/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => res.data.data);
  },

  updateTradingPreferences: (payload: {
    defaultAccountSize?: number;
    defaultRiskPercent?: number;
  }) =>
    apiClient
      .patch<ApiResponse<UserProfile>>("/settings/trading-preferences", payload)
      .then((res) => res.data.data),

  updateBrokerPreferences: (payload: {
    preferredBroker?: Broker;
    brokerSyncLookbackDays?: number;
  }) =>
    apiClient
      .patch<ApiResponse<UserProfile>>("/settings/broker-preferences", payload)
      .then((res) => res.data.data),

  updateNotificationPreferences: (payload: {
    emailNotificationsEnabled?: boolean;
    whatsappNotificationsEnabled?: boolean;
  }) =>
    apiClient
      .patch<ApiResponse<Pick<UserProfile, "id" | "emailNotificationsEnabled" | "whatsappNotificationsEnabled">>>(
        "/users/notifications",
        payload
      )
      .then((res) => res.data.data),

  listSessions: () =>
    apiClient
      .get<ApiResponse<SessionInfo[]>>("/settings/sessions")
      .then((res) => res.data.data),

  revokeSession: (id: string) =>
    apiClient.delete<ApiResponse<{ revoked: boolean }>>(`/settings/sessions/${id}`),

  deactivateAccount: (password: string) =>
    apiClient.post<ApiResponse<null>>("/users/deactivate", { password }),
};
