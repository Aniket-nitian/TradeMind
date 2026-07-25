export interface NewsHighlight {
  title: string;
  source: string;
  url: string;
  publishedAt: string;
}

export interface NewsItem {
  symbol: string;
  sentiment: string;
  summary: string;
  relevanceToTrader: string;
  highlights: NewsHighlight[];
}

export interface NewsResponse {
  symbolsCovered: string[];
  items: NewsItem[];
  overallNote: string;
}

export interface MarketNewsItem {
  headline: string;
  source: string;
  url: string;
  sentiment: "POSITIVE" | "NEGATIVE" | "NEUTRAL";
  publishedAt: string;
}

export interface MarketNewsResponse {
  items: MarketNewsItem[];
}
