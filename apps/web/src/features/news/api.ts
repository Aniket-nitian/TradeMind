import { aiClient } from "@/lib/api/ai-client";
import type { MarketNewsResponse, NewsResponse } from "./types";

export const newsApi = {
  get: () => aiClient.get<NewsResponse>("/news").then((res) => res.data),

  getMarket: () =>
    aiClient.get<MarketNewsResponse>("/news/market").then((res) => res.data),
};
