export interface CoachTrait {
  observation: string;
  coaching: string;
}

export interface PerformanceCoachResponse {
  summary: string;
  trajectory: CoachTrait;
  consistency: CoachTrait;
  riskOfRuin: CoachTrait;
  strengths: string[];
  focusAreas: string[];
}
