import { apiClient } from "@/lib/api/client";
import type { ApiResponse, Pagination } from "@/lib/api/types";
import type { AppNotification } from "./types";

interface NotificationsResponse {
  notifications: AppNotification[];
  unreadCount: number;
  pagination: Pagination;
}

export const notificationsApi = {
  list: (params: { page?: number; limit?: number } = {}) =>
    apiClient
      .get<ApiResponse<NotificationsResponse>>("/notifications", { params })
      .then((res) => res.data.data),

  markAsRead: (id: string) =>
    apiClient
      .patch<ApiResponse<AppNotification>>(`/notifications/${id}/read`)
      .then((res) => res.data.data),

  markAllAsRead: () =>
    apiClient.patch<ApiResponse<null>>("/notifications/read-all"),

  remove: (id: string) => apiClient.delete<ApiResponse<null>>(`/notifications/${id}`),
};
