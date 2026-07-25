export interface CoachTrait {
  observation: string;
  coaching: string;
}

export interface PsychologyCoachResponse {
  summary: string;
  fear: CoachTrait;
  greed: CoachTrait;
  fomo: CoachTrait;
  revengeTrading: CoachTrait;
  overconfidence: CoachTrait;
  impulsiveness: CoachTrait;
}
