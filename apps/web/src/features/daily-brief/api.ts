import { aiClient } from "@/lib/api/ai-client";
import type { DailyBriefResponse } from "./types";

export const dailyBriefApi = {
  get: () => aiClient.get<DailyBriefResponse>("/daily-brief").then((res) => res.data),
};
