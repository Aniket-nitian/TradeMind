import { aiClient } from "@/lib/api/ai-client";
import type { PerformanceCoachResponse } from "./types";

export const performanceCoachApi = {
  get: () =>
    aiClient.get<PerformanceCoachResponse>("/performance/coach").then((res) => res.data),
};
