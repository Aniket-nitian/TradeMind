export type Broker =
  | "ZERODHA"
  | "ANGEL_ONE"
  | "UPSTOX"
  | "GROWW"
  | "DHAN"
  | "FYERS"
  | "ICICI_DIRECT";

export const REGISTERED_BROKERS: Broker[] = ["DHAN", "GROWW"];

export const BROKER_LABELS: Record<Broker, string> = {
  ZERODHA: "Zerodha",
  ANGEL_ONE: "Angel One",
  UPSTOX: "Upstox",
  GROWW: "Groww",
  DHAN: "Dhan",
  FYERS: "Fyers",
  ICICI_DIRECT: "ICICI Direct",
};

export interface BrokerAccount {
  id: string;
  broker: Broker;
  brokerUserId: string | null;
  isConnected: boolean;
  lastSyncedAt: string | null;
  tokenExpiresAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SyncResult {
  syncLogId: string;
  status: "PENDING" | "COMPLETED" | "PARTIAL" | "FAILED";
  totalFetched: number;
  matchedTrades: number;
  importedRows: number;
  duplicateRows: number;
  skippedInvalid: number;
}

export interface BrokerSyncLog {
  id: string;
  brokerAccountId: string;
  broker: Broker;
  status: "PENDING" | "COMPLETED" | "PARTIAL" | "FAILED";
  fromDate: string;
  toDate: string;
  totalFetched: number;
  matchedTrades: number;
  importedRows: number;
  duplicateRows: number;
  createdAt: string;
}

export interface SyncHistoryResult {
  logs: BrokerSyncLog[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}
