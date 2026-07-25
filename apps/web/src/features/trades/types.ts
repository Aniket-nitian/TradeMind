import type { EMOTIONS, PRODUCTS, SEGMENTS, SIDES } from "@/lib/constants";
import type { Broker } from "@/features/broker/types";

export type Segment = (typeof SEGMENTS)[number];
export type Product = (typeof PRODUCTS)[number];
export type Side = (typeof SIDES)[number];
export type Emotion = (typeof EMOTIONS)[number];
export type TradeStatus = "OPEN" | "CLOSED";

export interface Strategy {
  id: string;
  name: string;
  description?: string | null;
  setupRules?: string | null;
  entryRules?: string | null;
  exitRules?: string | null;
  riskRules?: string | null;
  timeframe?: string | null;
  market?: string | null;
  isActive?: boolean;
}

export interface TradeSearchResult {
  id: string;
  symbol: string;
  side: Side;
  status: TradeStatus;
  entryTime: string;
  netPnl: number | null;
}

export interface Trade {
  id: string;
  symbol: string;
  segment: Segment;
  product: Product;
  side: Side;
  status: TradeStatus;
  quantity: number;
  broker: Broker | null;
  exchange: string | null;
  entryPrice: number;
  exitPrice: number | null;
  stopLoss: number | null;
  target: number | null;
  entryTime: string;
  exitTime: string | null;
  brokerage: number;
  taxes: number;
  grossPnl: number | null;
  netPnl: number | null;
  riskAmount: number | null;
  rewardAmount: number | null;
  rrRatio: number | null;
  confidence: number;
  strategyId: string | null;
  strategy?: Strategy | null;
  reasonForEntry: string | null;
  reasonForExit: string | null;
  followedPlan: boolean | null;
  tradeNotes: string | null;
  lessonLearned: string | null;
  emotionBefore: Emotion | null;
  emotionAfter: Emotion | null;
  createdAt: string;
  updatedAt: string;
}

export interface ChecklistItem {
  id: string;
  tradeId: string;
  title: string;
  isChecked: boolean;
  createdAt: string;
}

export interface TradeJournal {
  id: string;
  tradeNotes: string | null;
  lessonLearned: string | null;
  reasonForEntry: string | null;
  reasonForExit: string | null;
  followedPlan: boolean | null;
  updatedAt: string;
}

export interface TradeEmotions {
  id: string;
  emotionBefore: Emotion | null;
  emotionAfter: Emotion | null;
  updatedAt: string;
}

export interface TradeDetails extends Trade {
  mistakes: { id: string; name: string }[];
  checklist: ChecklistItem[];
}

export interface CreateTradeInput {
  symbol: string;
  segment: Segment;
  product: Product;
  side: Side;
  quantity: number;
  entryPrice: number;
  exitPrice?: number;
  stopLoss?: number;
  target?: number;
  brokerage?: number;
  taxes?: number;
  confidence?: number;
  strategyId?: string;
  entryTime: string;
  exitTime?: string;
  reasonForEntry?: string;
  reasonForExit?: string;
  followedPlan?: boolean;
  tradeNotes?: string;
  lessonLearned?: string;
  emotionBefore?: Emotion;
  emotionAfter?: Emotion;
}

export type UpdateTradeInput = Partial<CreateTradeInput>;
