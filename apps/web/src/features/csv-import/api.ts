import { apiClient } from "@/lib/api/client";
import type { ApiResponse, Pagination } from "@/lib/api/types";
import type { CsvConfirmResult, CsvImportHistoryItem, CsvPreviewResult } from "./types";

export const csvImportApi = {
  upload: (file: File, broker?: string) => {
    const formData = new FormData();
    formData.append("file", file);
    if (broker) formData.append("broker", broker);

    return apiClient
      .post<ApiResponse<CsvPreviewResult>>("/csv/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => res.data.data);
  },

  confirm: (importId: string) =>
    apiClient
      .post<ApiResponse<CsvConfirmResult>>(`/csv/${importId}/confirm`)
      .then((res) => res.data.data),

  history: (params: { page?: number; limit?: number } = {}) =>
    apiClient
      .get<ApiResponse<{ imports: CsvImportHistoryItem[]; pagination: Pagination }>>(
        "/csv/history",
        { params }
      )
      .then((res) => res.data.data),
};
