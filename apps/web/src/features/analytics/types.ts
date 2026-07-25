import type { Broker } from "@/features/broker/types";

export interface WinLossDistribution {
  wins: number;
  losses: number;
  breakeven: number;
}

export interface StrategyPerformance {
  strategyId: string;
  strategy: string;
  trades: number;
  wins: number;
  losses: number;
  winRate: number;
  averageRR: number;
  averageWin: number;
  averageLoss: number;
  netPnL: number;
  profitFactor: number;
}

export interface BrokerPerformance {
  broker: Broker | null;
  trades: number;
  wins: number;
  losses: number;
  winRate: number;
  averageRR: number;
  averageWin: number;
  averageLoss: number;
  netPnL: number;
  profitFactor: number;
}

export interface PsychologyPerformance {
  emotion: string;
  count: number;
  wins: number;
  losses: number;
  winRate: number;
  averageRR: number;
  averageTrade: number;
  averageWin: number;
  averageLoss: number;
  netPnL: number;
  profitFactor: number;
}

export interface CalendarDay {
  date: string;
  trades: number;
  wins: number;
  losses: number;
  netPnL: number;
}

export interface DrawdownStats {
  currentEquity: number;
  peakEquity: number;
  currentDrawdown: number;
  maxDrawdown: number;
  drawdownPercent: number;
  peakDate: string | null;
  currentDate: string | null;
}

export interface ConfidenceBucket {
  confidence: number;
  trades: number;
  wins: number;
  losses: number;
  winRate: number;
  averageRR: number;
  averageTrade: number;
  netPnL: number;
  profitFactor: number;
}
