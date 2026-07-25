export interface PositionSizeDto {
  accountSize: number;
  riskPercent: number;
  entryPrice: number;
  stopLoss: number;
}

export interface RiskRewardDto {
  entryPrice: number;
  stopLoss: number;
  targetPrice: number;
}

export interface StockAverageDto {
  firstQuantity: number;
  firstPrice: number;
  secondQuantity: number;
  secondPrice: number;
}

export interface BrokerageDto {
  buyPrice: number;
  sellPrice: number;
  quantity: number;
  brokeragePerOrder: number;
}