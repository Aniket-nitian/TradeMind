import { aiClient } from "@/lib/api/ai-client";
import type { TradeReviewResponse } from "./types";

export const tradeReviewApi = {
  get: (tradeId: string) =>
    aiClient.get<TradeReviewResponse>(`/trade-review/${tradeId}`).then((res) => res.data),
};
