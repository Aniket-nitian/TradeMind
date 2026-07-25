export interface Insight {
  observation: string;
  coaching: string;
}

export interface JournalInsightsResponse {
  summary: string;
  recurringLessons: string[];
  planAdherence: Insight;
  entryReasoningQuality: Insight;
  exitReasoningQuality: Insight;
  recommendations: string[];
}
