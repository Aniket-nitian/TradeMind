import { apiClient } from "@/lib/api/client";
import type { ApiResponse } from "@/lib/api/types";
import type { MistakeTagDef } from "./types";

export interface MistakeInput {
  name: string;
  description?: string;
}

export const mistakesApi = {
  list: () =>
    apiClient
      .get<ApiResponse<MistakeTagDef[]>>("/mistakes")
      .then((res) => res.data.data),

  create: (payload: MistakeInput) =>
    apiClient
      .post<ApiResponse<MistakeTagDef>>("/mistakes", payload)
      .then((res) => res.data.data),

  update: (id: string, payload: Partial<MistakeInput>) =>
    apiClient
      .put<ApiResponse<MistakeTagDef>>(`/mistakes/${id}`, payload)
      .then((res) => res.data.data),

  remove: (id: string) => apiClient.delete(`/mistakes/${id}`),

  attachToTrade: (tradeId: string, mistakeId: string) =>
    apiClient.post(`/mistakes/trades/${tradeId}/${mistakeId}`),

  removeFromTrade: (tradeId: string, mistakeId: string) =>
    apiClient.delete(`/mistakes/trades/${tradeId}/${mistakeId}`),
};
