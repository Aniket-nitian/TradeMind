import { apiClient } from "@/lib/api/client";
import type { ApiResponse } from "@/lib/api/types";
import type { Broker, BrokerAccount, SyncHistoryResult, SyncResult } from "./types";

export const brokerApi = {
  list: () =>
    apiClient.get<ApiResponse<BrokerAccount[]>>("/broker").then((res) => res.data.data),

  connect: (payload: {
    broker: Broker;
    dhanClientId?: string;
    accessToken?: string;
    apiKey?: string;
    apiSecret?: string;
    totpSecret?: string;
  }) =>
    apiClient
      .post<ApiResponse<BrokerAccount>>("/broker/connect", payload)
      .then((res) => res.data.data),

  disconnect: (broker: Broker) =>
    apiClient.delete<ApiResponse<{ broker: Broker; isConnected: boolean }>>(
      `/broker/${broker}`
    ),

  sync: (broker: Broker) =>
    apiClient
      .post<ApiResponse<SyncResult>>(`/broker/${broker}/sync`)
      .then((res) => res.data.data),

  syncHistory: (params: { page?: number; limit?: number }) =>
    apiClient
      .get<ApiResponse<SyncHistoryResult>>("/broker/sync-history", { params })
      .then((res) => res.data.data),
};
