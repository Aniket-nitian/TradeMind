import { apiClient } from "@/lib/api/client";
import type { ApiResponse } from "@/lib/api/types";
import type { IndexQuote } from "./types";

export const marketApi = {
  indices: () =>
    apiClient
      .get<ApiResponse<IndexQuote[]>>("/market/indices")
      .then((res) => res.data.data),
};
