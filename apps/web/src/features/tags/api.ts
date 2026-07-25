import { apiClient } from "@/lib/api/client";
import type { ApiResponse } from "@/lib/api/types";
import type { Tag } from "./types";

export interface TagInput {
  name: string;
  color?: string;
}

export const tagsApi = {
  list: () => apiClient.get<ApiResponse<Tag[]>>("/tags").then((res) => res.data.data),

  create: (payload: TagInput) =>
    apiClient.post<ApiResponse<Tag>>("/tags", payload).then((res) => res.data.data),

  update: (id: string, payload: Partial<TagInput>) =>
    apiClient.put<ApiResponse<Tag>>(`/tags/${id}`, payload).then((res) => res.data.data),

  remove: (id: string) => apiClient.delete(`/tags/${id}`),
};
