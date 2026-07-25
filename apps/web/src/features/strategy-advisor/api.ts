import { aiClient } from "@/lib/api/ai-client";
import type { StrategyAdvisorResponse } from "./types";

export const strategyAdvisorApi = {
  get: () =>
    aiClient.get<StrategyAdvisorResponse>("/strategy/advisor").then((res) => res.data),
};
