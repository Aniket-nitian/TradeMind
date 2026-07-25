import { aiClient } from "@/lib/api/ai-client";
import type { JournalInsightsResponse } from "./types";

export const journalInsightsApi = {
  get: () => aiClient.get<JournalInsightsResponse>("/journal/analysis").then((res) => res.data),
};
