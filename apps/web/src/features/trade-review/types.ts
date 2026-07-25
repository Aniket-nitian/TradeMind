export interface Insight {
  observation: string;
  coaching: string;
}

export interface TradeReviewResponse {
  score: number;
  entry: Insight;
  exit: Insight;
  riskManagement: Insight;
  emotion: Insight;
  discipline: Insight;
  mistakes: string[];
  improvements: string[];
}
