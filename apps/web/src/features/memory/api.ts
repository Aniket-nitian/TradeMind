import { aiClient } from "@/lib/api/ai-client";
import type { AiMemoryResponse } from "./types";

export const memoryApi = {
  get: () => aiClient.get<AiMemoryResponse>("/memory").then((res) => res.data),
  refresh: () => aiClient.post<AiMemoryResponse>("/memory/refresh").then((res) => res.data),
};
