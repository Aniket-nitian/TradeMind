export interface DashboardOverview {
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  breakevenTrades: number;
  winRate: number;
  grossProfit: number;
  grossLoss: number;
  netPnL: number;
  averageWin: number;
  averageLoss: number;
  averageRR: number;
  profitFactor: number;
  expectancy: number;
}

export interface EquityPoint {
  date: string;
  equity: number;
}
