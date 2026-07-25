import { apiClient } from "@/lib/api/client";
import type { ApiResponse, Paginated } from "@/lib/api/types";
import type { TradeListParams } from "@/lib/api/query-keys";
import type {
  ChecklistItem,
  CreateTradeInput,
  Trade,
  TradeDetails,
  TradeEmotions,
  TradeJournal,
  TradeSearchResult,
  UpdateTradeInput,
} from "./types";

export const tradesApi = {
  list: (params: TradeListParams) =>
    apiClient
      .get<{ success: boolean; data: Paginated<Trade> }>("/trades", {
        params,
      })
      .then((res) => res.data.data),

  search: (q: string, limit = 8) =>
    apiClient
      .get<ApiResponse<TradeSearchResult[]>>("/trades/search", {
        params: { q, limit },
      })
      .then((res) => res.data.data),

  getOne: (id: string) =>
    apiClient
      .get<ApiResponse<Trade>>(`/trades/${id}`)
      .then((res) => res.data.data),

  getDetails: (id: string) =>
    apiClient
      .get<ApiResponse<TradeDetails>>(`/trades/${id}/details`)
      .then((res) => res.data.data),

  create: (payload: CreateTradeInput) =>
    apiClient
      .post<{ success: boolean; message: string; data: Trade }>(
        "/trades",
        payload
      )
      .then((res) => res.data.data),

  update: (id: string, payload: UpdateTradeInput) =>
    apiClient
      .put<ApiResponse<Trade>>(`/trades/${id}`, payload)
      .then((res) => res.data.data),

  remove: (id: string) => apiClient.delete(`/trades/${id}`),

  getJournal: (id: string) =>
    apiClient
      .get<ApiResponse<TradeJournal>>(`/trades/${id}/journal`)
      .then((res) => res.data.data),

  updateJournal: (
    id: string,
    payload: Partial<
      Pick<
        TradeJournal,
        "tradeNotes" | "lessonLearned" | "reasonForEntry" | "reasonForExit"
      >
    > & { followedPlan?: boolean }
  ) =>
    apiClient
      .patch<ApiResponse<TradeJournal>>(`/trades/${id}/journal`, payload)
      .then((res) => res.data.data),

  getChecklist: (id: string) =>
    apiClient
      .get<ApiResponse<ChecklistItem[]>>(`/trades/${id}/checklist`)
      .then((res) => res.data.data),

  addChecklistItem: (id: string, title: string) =>
    apiClient
      .post<ApiResponse<ChecklistItem>>(`/trades/${id}/checklist`, { title })
      .then((res) => res.data.data),

  updateChecklistItem: (
    checklistId: string,
    payload: { title?: string; isChecked?: boolean }
  ) =>
    apiClient
      .patch<ApiResponse<ChecklistItem>>(
        `/trades/checklist/${checklistId}`,
        payload
      )
      .then((res) => res.data.data),

  deleteChecklistItem: (checklistId: string) =>
    apiClient.delete(`/trades/checklist/${checklistId}`),

  getEmotions: (id: string) =>
    apiClient
      .get<ApiResponse<TradeEmotions>>(`/trades/${id}/emotions`)
      .then((res) => res.data.data),

  updateEmotions: (
    id: string,
    payload: { emotionBefore?: string; emotionAfter?: string }
  ) =>
    apiClient
      .patch<ApiResponse<TradeEmotions>>(`/trades/${id}/emotions`, payload)
      .then((res) => res.data.data),
};
