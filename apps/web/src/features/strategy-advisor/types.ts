export type StrategyRecommendation = "KEEP" | "ADJUST" | "DROP";

export interface StrategyAdvice {
  name: string;
  observation: string;
  coaching: string;
  recommendation: StrategyRecommendation;
}

export interface StrategyAdvisorResponse {
  summary: string;
  strategies: StrategyAdvice[];
}
