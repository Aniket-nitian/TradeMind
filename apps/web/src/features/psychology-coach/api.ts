import { aiClient } from "@/lib/api/ai-client";
import type { PsychologyCoachResponse } from "./types";

export const psychologyCoachApi = {
  get: () =>
    aiClient.get<PsychologyCoachResponse>("/psychology/coach").then((res) => res.data),
};
