export interface TradeListParams {
  page?: number;
  limit?: number;
}

export interface ListParams {
  page?: number;
  limit?: number;
}

export const queryKeys = {
  auth: {
    profile: ["auth", "profile"] as const,
  },
  trades: {
    all: ["trades"] as const,
    list: (params: TradeListParams) => ["trades", "list", params] as const,
    detail: (id: string) => ["trades", "detail", id] as const,
    journal: (id: string) => ["trades", "journal", id] as const,
    checklist: (id: string) => ["trades", "checklist", id] as const,
    emotions: (id: string) => ["trades", "emotions", id] as const,
    search: (query: string) => ["trades", "search", query] as const,
  },
  strategies: {
    list: ["strategies", "list"] as const,
  },
  dashboard: {
    overview: ["dashboard", "overview"] as const,
    equityCurve: ["dashboard", "equity-curve"] as const,
  },
  analytics: {
    winLoss: ["analytics", "win-loss"] as const,
    strategies: ["analytics", "strategies"] as const,
    brokers: ["analytics", "brokers"] as const,
    mistakes: ["analytics", "mistakes"] as const,
    psychology: ["analytics", "psychology"] as const,
    calendar: ["analytics", "calendar"] as const,
    drawdown: ["analytics", "drawdown"] as const,
    confidence: ["analytics", "confidence"] as const,
  },
  notifications: {
    all: ["notifications"] as const,
    list: (params: ListParams) => ["notifications", "list", params] as const,
  },
  market: {
    indices: ["market", "indices"] as const,
  },
  portfolio: {
    value: ["portfolio", "value"] as const,
    holdings: ["portfolio", "holdings"] as const,
    capitalAll: ["portfolio", "capital"] as const,
    capitalList: (params: ListParams) =>
      ["portfolio", "capital", "list", params] as const,
    snapshotAll: ["portfolio", "snapshots"] as const,
    snapshotList: (params: ListParams) =>
      ["portfolio", "snapshots", "list", params] as const,
    analytics: ["portfolio", "analytics"] as const,
  },
  settings: {
    root: ["settings"] as const,
    sessions: ["settings", "sessions"] as const,
  },
  subscription: {
    status: ["subscription", "status"] as const,
    paymentsAll: ["subscription", "payments"] as const,
    payments: (params: ListParams) =>
      ["subscription", "payments", "list", params] as const,
  },
  broker: {
    accounts: ["broker", "accounts"] as const,
    syncHistoryAll: ["broker", "sync-history"] as const,
    syncHistory: (params: ListParams) =>
      ["broker", "sync-history", "list", params] as const,
  },
  mistakesCatalog: {
    list: ["mistakes-catalog", "list"] as const,
  },
  tags: {
    list: ["tags", "list"] as const,
  },
  csvImport: {
    history: ["csv-import", "history"] as const,
  },
  psychologyCoach: {
    root: ["psychology-coach"] as const,
  },
  strategyAdvisor: {
    root: ["strategy-advisor"] as const,
  },
  performanceCoach: {
    root: ["performance-coach"] as const,
  },
  dailyBrief: {
    root: ["daily-brief"] as const,
  },
  journalInsights: {
    root: ["journal-insights"] as const,
  },
  aiMemory: {
    root: ["ai-memory"] as const,
  },
  tradeReview: {
    detail: (tradeId: string) => ["trade-review", tradeId] as const,
  },
  news: {
    root: ["news"] as const,
    market: ["news", "market"] as const,
  },
};
