export interface CAGRDto {
  initialValue: number;
  finalValue: number;
  years: number;
}

export interface LumpsumDto {
  principal: number;
  annualReturn: number;
  years: number;
}

export interface SIPDto {
  monthlyInvestment: number;
  annualReturn: number;
  years: number;
}

export interface GoalCalculatorDto {
  targetAmount: number;
  annualReturn: number;
  years: number;
}