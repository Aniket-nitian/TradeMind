export interface NormalizedTradeRow {
  symbol: string;
  segment: string;
  product: string;
  side: string;
  quantity: number;
  entryPrice: number;
  exitPrice: number | null;
  entryTime: string;
  exitTime: string | null;
  stopLoss: number | null;
  target: number | null;
  brokerage: number;
  taxes: number;
  confidence: number | null;
}

export interface CsvRowError {
  row: number;
  field: string;
  message: string;
}

export interface CsvPreviewResult {
  importId: string;
  detectedBroker: string | null;
  totalRows: number;
  validRows: number;
  invalidRows: number;
  duplicateRows: number;
  readyToImport: number;
  preview: NormalizedTradeRow[];
  errors: CsvRowError[];
}

export type CsvImportStatus = "PENDING" | "COMPLETED" | "PARTIAL" | "FAILED";

export interface CsvConfirmResult {
  importId: string;
  status: CsvImportStatus;
  importedRows: number;
  skippedDuplicates: number;
  skippedInvalid: number;
}

export interface CsvImportHistoryItem {
  id: string;
  fileName: string;
  broker: string | null;
  status: CsvImportStatus;
  totalRows: number;
  validRows: number;
  invalidRows: number;
  duplicateRows: number;
  importedRows: number;
  createdAt: string;
  updatedAt: string;
}

export const CSV_BROKERS = [
  { value: "DHAN", label: "Dhan" },
  { value: "GROWW", label: "Groww" },
  { value: "ZERODHA", label: "Zerodha" },
  { value: "FYERS", label: "Fyers" },
  { value: "ANGEL_ONE", label: "Angel One" },
] as const;
