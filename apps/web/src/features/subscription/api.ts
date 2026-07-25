import { apiClient } from "@/lib/api/client";
import type { ApiResponse } from "@/lib/api/types";
import type {
  PaymentHistoryResult,
  SubscribeResponse,
  SubscriptionStatusResponse,
  VerifySubscriptionPayload,
} from "./types";

export const subscriptionApi = {
  status: () =>
    apiClient
      .get<ApiResponse<SubscriptionStatusResponse>>("/subscription")
      .then((res) => res.data.data),

  subscribe: () =>
    apiClient
      .post<ApiResponse<SubscribeResponse>>("/subscription/subscribe")
      .then((res) => res.data.data),

  verify: (payload: VerifySubscriptionPayload) =>
    apiClient
      .post<ApiResponse<SubscriptionStatusResponse>>("/subscription/verify", payload)
      .then((res) => res.data.data),

  sync: () =>
    apiClient
      .post<ApiResponse<SubscriptionStatusResponse>>("/subscription/sync")
      .then((res) => res.data.data),

  cancel: () =>
    apiClient
      .post<ApiResponse<{ status: string }>>("/subscription/cancel")
      .then((res) => res.data.data),

  payments: (params: { page?: number; limit?: number }) =>
    apiClient
      .get<ApiResponse<PaymentHistoryResult>>("/subscription/payments", { params })
      .then((res) => res.data.data),
};
