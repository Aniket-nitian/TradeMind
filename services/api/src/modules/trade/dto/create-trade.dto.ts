export interface CreateTradeDto {
  broker?: string;
  exchange?: string;

  symbol: string;

  segment:
    | "EQUITY"
    | "FUTURES"
    | "OPTIONS"
    | "CURRENCY"
    | "COMMODITY";

  product:
    | "CNC"
    | "MIS"
    | "NRML";

  side:
    | "BUY"
    | "SELL";

  quantity: number;

  entryPrice: number;

  exitPrice?: number;

  stopLoss?: number;

  target?: number;

  brokerage?: number;

  taxes?: number;

  confidence?: number;

  strategyId?: string;

  notes?: string;

  lessonLearned?: string;

  emotionBefore?:
    | "CONFIDENT"
    | "FEAR"
    | "GREED"
    | "FOMO"
    | "REVENGE"
    | "DISCIPLINED"
    | "HESITATION";

  emotionAfter?:
    | "CONFIDENT"
    | "FEAR"
    | "GREED"
    | "FOMO"
    | "REVENGE"
    | "DISCIPLINED"
    | "HESITATION";

  entryTime: string;

  exitTime?: string;
}