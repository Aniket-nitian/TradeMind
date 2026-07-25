export interface PositionSizeRequest {
  accountSize: number;
  riskPercent: number;
  entryPrice: number;
  stopLoss: number;
}
export interface PositionSizeResult {
  riskAmount: number;
  stopLossDistance: number;
  quantity: number;
  positionValue: number;
}

export interface RiskRewardRequest {
  entryPrice: number;
  stopLoss: number;
  targetPrice: number;
}
export interface RiskRewardResult {
  risk: number;
  reward: number;
  ratio: number;
}

export interface StockAverageRequest {
  firstQuantity: number;
  firstPrice: number;
  secondQuantity: number;
  secondPrice: number;
}
export interface StockAverageResult {
  totalQuantity: number;
  totalInvestment: number;
  averagePrice: number;
}

export interface BrokerageRequest {
  buyPrice: number;
  sellPrice: number;
  quantity: number;
  brokeragePerOrder: number;
}
export interface BrokerageResult {
  turnover: number;
  brokerage: number;
  grossPnL: number;
  netPnL: number;
}

export interface MarginRequest {
  capital: number;
  leverage: number;
  entryPrice: number;
}
export interface MarginResult {
  capital: number;
  leverage: number;
  buyingPower: number;
  quantity: number;
  marginUsed: number;
  unusedBuyingPower: number;
}

export interface PivotPointRequest {
  high: number;
  low: number;
  close: number;
}
export interface PivotPointResult {
  pivot: number;
  resistance1: number;
  support1: number;
  resistance2: number;
  support2: number;
}

export interface FibonacciRequest {
  high: number;
  low: number;
}
export interface FibonacciResult {
  high: number;
  low: number;
  levels: Record<string, number>;
}

export interface CagrRequest {
  initialValue: number;
  finalValue: number;
  years: number;
}
export interface CagrResult {
  cagr: number;
}

export interface LumpsumRequest {
  principal: number;
  annualReturn: number;
  years: number;
}
export interface LumpsumResult {
  investedAmount: number;
  maturityAmount: number;
  wealthGained: number;
}

export interface SipRequest {
  monthlyInvestment: number;
  annualReturn: number;
  years: number;
}
export interface SipResult {
  investedAmount: number;
  maturityAmount: number;
  wealthGained: number;
}

export interface GoalRequest {
  targetAmount: number;
  annualReturn: number;
  years: number;
}
export interface GoalResult {
  monthlyInvestment: number;
  targetAmount: number;
}
