import type { Pagination } from "@/lib/api/types";

export type CapitalTransactionType = "DEPOSIT" | "WITHDRAWAL";

export interface Holding {
  symbol: string;
  segment: string;
  product: string;
  side: string;
  quantity: number;
  avgEntryPrice: number;
  investedValue: number;
  strategyName: string | null;
  currentPrice: number | null;
  currentValue: number | null;
  unrealizedPnl: number | null;
  unrealizedPnlPercent: number | null;
}

export interface PortfolioValue {
  netCapital: number;
  invested: number;
  realizedPnl: number;
  unrealizedPnl: number;
  cash: number;
  totalValue: number;
}

export interface CapitalTransaction {
  id: string;
  type: CapitalTransactionType;
  amount: number;
  note: string | null;
  transactionDate: string;
  createdAt: string;
}

export interface CapitalHistoryResult {
  transactions: CapitalTransaction[];
  pagination: Pagination;
}

export interface RecordCapitalInput {
  type: CapitalTransactionType;
  amount: number;
  note?: string;
  transactionDate?: string;
}

export interface PortfolioSnapshot {
  id: string;
  totalValue: number;
  invested: number;
  unrealizedPnl: number | null;
  realizedPnl: number;
  cash: number;
  createdAt: string;
}

export interface SnapshotHistoryResult {
  snapshots: PortfolioSnapshot[];
  pagination: Pagination;
}

export interface PortfolioAnalytics {
  allocation: {
    bySymbol: { symbol: string; investedValue: number }[];
    bySegment: { segment: string; investedValue: number }[];
    byStrategy: { strategy: string; investedValue: number }[];
  };
  capitalUtilization: number;
  returnPct: number;
}
