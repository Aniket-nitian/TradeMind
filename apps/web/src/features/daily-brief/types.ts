export interface Insight {
  observation: string;
  coaching: string;
}

export interface DailyBriefResponse {
  previousDaySummary: string;
  marketSummary: string;
  tradingChecklist: string[];
  riskReminder: string;
  psychology: Insight;
  discipline: Insight;
  riskManagement: Insight;
  execution: Insight;
  confidence: Insight;
  improvement: Insight;
}
