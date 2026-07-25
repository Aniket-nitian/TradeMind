export const SEGMENTS = [
  "EQUITY",
  "FUTURES",
  "OPTIONS",
  "CURRENCY",
  "COMMODITY",
] as const;

export const PRODUCTS = ["CNC", "MIS", "NRML"] as const;

export const SIDES = ["BUY", "SELL"] as const;

export const EMOTIONS = [
  "CONFIDENT",
  "FEAR",
  "GREED",
  "FOMO",
  "REVENGE",
  "DISCIPLINED",
  "HESITATION",
  "CALM",
  "ANXIOUS",
  "FOCUSED",
  "BORED",
] as const;

export const FREE_PLAN_TRADE_LIMIT = 50;

export type Segment = (typeof SEGMENTS)[number];
export type Product = (typeof PRODUCTS)[number];
export type Side = (typeof SIDES)[number];
export type Emotion = (typeof EMOTIONS)[number];
