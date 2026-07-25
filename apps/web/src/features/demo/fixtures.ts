import type { Broker } from "@/features/broker/types";
import type {
  BrokerPerformance,
  CalendarDay,
  ConfidenceBucket,
  DrawdownStats,
  PsychologyPerformance,
  StrategyPerformance,
  WinLossDistribution,
} from "@/features/analytics/types";
import type { DashboardOverview, EquityPoint } from "@/features/dashboard/types";
import type { PerformanceCoachResponse } from "@/features/performance-coach/types";
import type { MarketNewsResponse, NewsResponse } from "@/features/news/types";
import type { IndexQuote } from "@/features/market/types";
import type { Strategy, Trade } from "@/features/trades/types";
import type { Pagination } from "@/lib/api/types";

export const DEMO_STRATEGIES: Strategy[] = [
  { id: "demo-strategy-breakout", name: "Breakout", isActive: true },
  { id: "demo-strategy-trend", name: "Trend Following", isActive: true },
  { id: "demo-strategy-meanrev", name: "Mean Reversion", isActive: true },
];

interface RawTrade {
  symbol: string;
  side: Trade["side"];
  strategyId: string;
  broker: Broker | null;
  emotion: Trade["emotionBefore"];
  confidence: number;
  date: string;
  entryPrice: number;
  exitPrice: number | null;
  quantity: number;
  netPnl: number | null;
  rrRatio: number | null;
  status: Trade["status"];
}

const RAW_TRADES: RawTrade[] = [
  { symbol: "RELIANCE", side: "BUY", strategyId: "demo-strategy-breakout", broker: null, emotion: "CONFIDENT", confidence: 8, date: "2026-06-05", entryPrice: 2900, exitPrice: 2936, quantity: 50, netPnl: 1800, rrRatio: 2.0, status: "CLOSED" },
  { symbol: "TCS", side: "SELL", strategyId: "demo-strategy-trend", broker: null, emotion: "DISCIPLINED", confidence: 7, date: "2026-06-08", entryPrice: 3900, exitPrice: 3847, quantity: 30, netPnl: 1600, rrRatio: 1.8, status: "CLOSED" },
  { symbol: "INFY", side: "BUY", strategyId: "demo-strategy-meanrev", broker: null, emotion: "FOMO", confidence: 4, date: "2026-06-10", entryPrice: 1800, exitPrice: 1787, quantity: 60, netPnl: -800, rrRatio: 0.5, status: "CLOSED" },
  { symbol: "HDFCBANK", side: "BUY", strategyId: "demo-strategy-breakout", broker: "DHAN", emotion: "FOCUSED", confidence: 8, date: "2026-06-12", entryPrice: 1650, exitPrice: 1682, quantity: 80, netPnl: 2600, rrRatio: 2.6, status: "CLOSED" },
  { symbol: "RELIANCE", side: "SELL", strategyId: "demo-strategy-trend", broker: null, emotion: "REVENGE", confidence: 4, date: "2026-06-15", entryPrice: 2960, exitPrice: 2982, quantity: 40, netPnl: -900, rrRatio: 0.6, status: "CLOSED" },
  { symbol: "TCS", side: "BUY", strategyId: "demo-strategy-meanrev", broker: null, emotion: "CALM", confidence: 7, date: "2026-06-17", entryPrice: 3820, exitPrice: 3907, quantity: 25, netPnl: 2600, rrRatio: 2.3, status: "CLOSED" },
  { symbol: "INFY", side: "SELL", strategyId: "demo-strategy-breakout", broker: null, emotion: "DISCIPLINED", confidence: 8, date: "2026-06-19", entryPrice: 1790, exitPrice: 1759, quantity: 70, netPnl: 2200, rrRatio: 2.1, status: "CLOSED" },
  { symbol: "HDFCBANK", side: "SELL", strategyId: "demo-strategy-trend", broker: null, emotion: "ANXIOUS", confidence: 5, date: "2026-06-22", entryPrice: 1670, exitPrice: 1692, quantity: 60, netPnl: -1300, rrRatio: 0.5, status: "CLOSED" },
  { symbol: "RELIANCE", side: "BUY", strategyId: "demo-strategy-meanrev", broker: "DHAN", emotion: "CONFIDENT", confidence: 9, date: "2026-06-25", entryPrice: 2920, exitPrice: 2984, quantity: 45, netPnl: 3800, rrRatio: 3.2, status: "CLOSED" },
  { symbol: "TCS", side: "SELL", strategyId: "demo-strategy-breakout", broker: null, emotion: "FOCUSED", confidence: 8, date: "2026-06-28", entryPrice: 3910, exitPrice: 3836, quantity: 35, netPnl: 2600, rrRatio: 2.4, status: "CLOSED" },
  { symbol: "INFY", side: "BUY", strategyId: "demo-strategy-trend", broker: "DHAN", emotion: "HESITATION", confidence: 4, date: "2026-07-01", entryPrice: 1810, exitPrice: 1786, quantity: 55, netPnl: -1300, rrRatio: 0.6, status: "CLOSED" },
  { symbol: "HDFCBANK", side: "BUY", strategyId: "demo-strategy-meanrev", broker: null, emotion: "CALM", confidence: 8, date: "2026-07-04", entryPrice: 1660, exitPrice: 1735, quantity: 65, netPnl: 2600, rrRatio: 2.4, status: "CLOSED" },
  { symbol: "RELIANCE", side: "SELL", strategyId: "demo-strategy-breakout", broker: null, emotion: "DISCIPLINED", confidence: 9, date: "2026-07-08", entryPrice: 2975, exitPrice: 2877, quantity: 50, netPnl: 4900, rrRatio: 3.6, status: "CLOSED" },
  { symbol: "TCS", side: "BUY", strategyId: "demo-strategy-trend", broker: null, emotion: "GREED", confidence: 5, date: "2026-07-11", entryPrice: 3850, exitPrice: 3790, quantity: 30, netPnl: -1800, rrRatio: 0.7, status: "CLOSED" },
  { symbol: "INFY", side: "SELL", strategyId: "demo-strategy-meanrev", broker: null, emotion: "FOCUSED", confidence: 9, date: "2026-07-15", entryPrice: 1795, exitPrice: 1738, quantity: 60, netPnl: 3400, rrRatio: 2.9, status: "CLOSED" },
  { symbol: "HDFCBANK", side: "SELL", strategyId: "demo-strategy-breakout", broker: null, emotion: "CONFIDENT", confidence: 9, date: "2026-07-18", entryPrice: 1705, exitPrice: 1601, quantity: 50, netPnl: 5200, rrRatio: 3.8, status: "CLOSED" },
  { symbol: "RELIANCE", side: "BUY", strategyId: "demo-strategy-breakout", broker: null, emotion: "FOCUSED", confidence: 7, date: "2026-07-22", entryPrice: 3010, exitPrice: null, quantity: 40, netPnl: null, rrRatio: null, status: "OPEN" },
];

function toIso(date: string, hour = 10) {
  return new Date(`${date}T${String(hour).padStart(2, "0")}:15:00.000Z`).toISOString();
}

export const DEMO_TRADES: Trade[] = RAW_TRADES.map((t, i) => {
  const strategy = DEMO_STRATEGIES.find((s) => s.id === t.strategyId) ?? null;
  return {
    id: `demo-trade-${i + 1}`,
    symbol: t.symbol,
    segment: "EQUITY",
    product: t.broker ? "CNC" : "MIS",
    side: t.side,
    status: t.status,
    quantity: t.quantity,
    broker: t.broker,
    exchange: "NSE",
    entryPrice: t.entryPrice,
    exitPrice: t.exitPrice,
    stopLoss: t.side === "BUY" ? t.entryPrice * 0.98 : t.entryPrice * 1.02,
    target: t.side === "BUY" ? t.entryPrice * 1.03 : t.entryPrice * 0.97,
    entryTime: toIso(t.date),
    exitTime: t.exitPrice === null ? null : toIso(t.date, 14),
    brokerage: 0,
    taxes: 0,
    grossPnl: t.netPnl,
    netPnl: t.netPnl,
    riskAmount: t.netPnl === null ? null : Math.round(Math.abs(t.netPnl) / (t.rrRatio ?? 1)),
    rewardAmount: t.netPnl === null ? null : Math.abs(t.netPnl),
    rrRatio: t.rrRatio,
    confidence: t.confidence,
    strategyId: t.strategyId,
    strategy,
    reasonForEntry: "Setup matched the plan — clean structure, volume confirmation.",
    reasonForExit: t.exitPrice === null ? null : "Target/stop hit as planned.",
    followedPlan: t.confidence >= 6,
    tradeNotes: null,
    lessonLearned: null,
    emotionBefore: t.emotion,
    emotionAfter: null,
    createdAt: toIso(t.date),
    updatedAt: toIso(t.date),
  };
});

const CLOSED = DEMO_TRADES.filter((t) => t.status === "CLOSED" && t.netPnl !== null);
const WINS = CLOSED.filter((t) => (t.netPnl ?? 0) > 0);
const LOSSES = CLOSED.filter((t) => (t.netPnl ?? 0) < 0);

const sum = (arr: Trade[]) => arr.reduce((s, t) => s + (t.netPnl ?? 0), 0);
const grossProfit = sum(WINS);
const grossLoss = sum(LOSSES);
const netPnL = grossProfit + grossLoss;
const averageRR =
  CLOSED.reduce((s, t) => s + (t.rrRatio ?? 0), 0) / CLOSED.length;

export const DEMO_OVERVIEW: DashboardOverview = {
  totalTrades: CLOSED.length,
  winningTrades: WINS.length,
  losingTrades: LOSSES.length,
  breakevenTrades: 0,
  winRate: Math.round((WINS.length / CLOSED.length) * 1000) / 10,
  grossProfit,
  grossLoss,
  netPnL,
  averageWin: Math.round(grossProfit / WINS.length),
  averageLoss: Math.round(grossLoss / LOSSES.length),
  averageRR: Math.round(averageRR * 100) / 100,
  profitFactor: Math.round((grossProfit / Math.abs(grossLoss)) * 100) / 100,
  expectancy: Math.round(netPnL / CLOSED.length),
};

export const DEMO_EQUITY_CURVE: EquityPoint[] = (() => {
  let running = 0;
  return CLOSED.map((t) => {
    running += t.netPnl ?? 0;
    return { date: t.entryTime.slice(0, 10), equity: running };
  });
})();

export const DEMO_DRAWDOWN: DrawdownStats = (() => {
  let peak = 0;
  let peakDate = DEMO_EQUITY_CURVE[0]?.date ?? null;
  let maxDrawdown = 0;
  let maxDrawdownPercent = 0;
  for (const point of DEMO_EQUITY_CURVE) {
    if (point.equity > peak) {
      peak = point.equity;
      peakDate = point.date;
    }
    const dd = peak - point.equity;
    if (dd > maxDrawdown) {
      maxDrawdown = dd;
      maxDrawdownPercent = peak > 0 ? Math.round((dd / peak) * 1000) / 10 : 0;
    }
  }
  const last = DEMO_EQUITY_CURVE[DEMO_EQUITY_CURVE.length - 1];
  return {
    currentEquity: last?.equity ?? 0,
    peakEquity: peak,
    currentDrawdown: peak - (last?.equity ?? 0),
    maxDrawdown,
    drawdownPercent: maxDrawdownPercent,
    peakDate,
    currentDate: last?.date ?? null,
  };
})();

export const DEMO_WIN_LOSS: WinLossDistribution = {
  wins: WINS.length,
  losses: LOSSES.length,
  breakeven: 0,
};

function groupByStrategy(): StrategyPerformance[] {
  return DEMO_STRATEGIES.map((strat) => {
    const trades = CLOSED.filter((t) => t.strategyId === strat.id);
    const wins = trades.filter((t) => (t.netPnl ?? 0) > 0);
    const losses = trades.filter((t) => (t.netPnl ?? 0) < 0);
    const gp = sum(wins);
    const gl = sum(losses);
    return {
      strategyId: strat.id,
      strategy: strat.name,
      trades: trades.length,
      wins: wins.length,
      losses: losses.length,
      winRate: trades.length ? Math.round((wins.length / trades.length) * 1000) / 10 : 0,
      averageRR:
        Math.round(
          (trades.reduce((s, t) => s + (t.rrRatio ?? 0), 0) / (trades.length || 1)) * 100
        ) / 100,
      averageWin: wins.length ? Math.round(gp / wins.length) : 0,
      averageLoss: losses.length ? Math.round(gl / losses.length) : 0,
      netPnL: gp + gl,
      profitFactor: gl !== 0 ? Math.round((gp / Math.abs(gl)) * 100) / 100 : gp > 0 ? 99 : 0,
    };
  });
}

export const DEMO_STRATEGY_PERFORMANCE: StrategyPerformance[] = groupByStrategy();

function groupByBroker(): BrokerPerformance[] {
  const buckets = new Map<Broker | null, Trade[]>();
  for (const t of CLOSED) {
    const key = t.broker;
    buckets.set(key, [...(buckets.get(key) ?? []), t]);
  }
  return [...buckets.entries()].map(([broker, trades]) => {
    const wins = trades.filter((t) => (t.netPnl ?? 0) > 0);
    const losses = trades.filter((t) => (t.netPnl ?? 0) < 0);
    const gp = sum(wins);
    const gl = sum(losses);
    return {
      broker,
      trades: trades.length,
      wins: wins.length,
      losses: losses.length,
      winRate: trades.length ? Math.round((wins.length / trades.length) * 1000) / 10 : 0,
      averageRR:
        Math.round(
          (trades.reduce((s, t) => s + (t.rrRatio ?? 0), 0) / (trades.length || 1)) * 100
        ) / 100,
      averageWin: wins.length ? Math.round(gp / wins.length) : 0,
      averageLoss: losses.length ? Math.round(gl / losses.length) : 0,
      netPnL: gp + gl,
      profitFactor: gl !== 0 ? Math.round((gp / Math.abs(gl)) * 100) / 100 : gp > 0 ? 99 : 0,
    };
  });
}

export const DEMO_BROKER_PERFORMANCE: BrokerPerformance[] = groupByBroker();

function groupByEmotion(): PsychologyPerformance[] {
  const buckets = new Map<string, Trade[]>();
  for (const t of CLOSED) {
    const key = t.emotionBefore ?? "UNKNOWN";
    buckets.set(key, [...(buckets.get(key) ?? []), t]);
  }
  return [...buckets.entries()].map(([emotion, trades]) => {
    const wins = trades.filter((t) => (t.netPnl ?? 0) > 0);
    const losses = trades.filter((t) => (t.netPnl ?? 0) < 0);
    const gp = sum(wins);
    const gl = sum(losses);
    const net = gp + gl;
    return {
      emotion,
      count: trades.length,
      wins: wins.length,
      losses: losses.length,
      winRate: trades.length ? Math.round((wins.length / trades.length) * 1000) / 10 : 0,
      averageRR:
        Math.round(
          (trades.reduce((s, t) => s + (t.rrRatio ?? 0), 0) / (trades.length || 1)) * 100
        ) / 100,
      averageTrade: Math.round(net / trades.length),
      averageWin: wins.length ? Math.round(gp / wins.length) : 0,
      averageLoss: losses.length ? Math.round(gl / losses.length) : 0,
      netPnL: net,
      profitFactor: gl !== 0 ? Math.round((gp / Math.abs(gl)) * 100) / 100 : gp > 0 ? 99 : 0,
    };
  });
}

export const DEMO_PSYCHOLOGY_PERFORMANCE: PsychologyPerformance[] = groupByEmotion();

export const DEMO_CALENDAR: CalendarDay[] = CLOSED.map((t) => ({
  date: t.entryTime.slice(0, 10),
  trades: 1,
  wins: (t.netPnl ?? 0) > 0 ? 1 : 0,
  losses: (t.netPnl ?? 0) < 0 ? 1 : 0,
  netPnL: t.netPnl ?? 0,
}));

function groupByConfidence(): ConfidenceBucket[] {
  const buckets = new Map<number, Trade[]>();
  for (const t of CLOSED) {
    buckets.set(t.confidence, [...(buckets.get(t.confidence) ?? []), t]);
  }
  return [...buckets.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([confidence, trades]) => {
      const wins = trades.filter((t) => (t.netPnl ?? 0) > 0);
      const losses = trades.filter((t) => (t.netPnl ?? 0) < 0);
      const gp = sum(wins);
      const gl = sum(losses);
      const net = gp + gl;
      return {
        confidence,
        trades: trades.length,
        wins: wins.length,
        losses: losses.length,
        winRate: trades.length ? Math.round((wins.length / trades.length) * 1000) / 10 : 0,
        averageRR:
          Math.round(
            (trades.reduce((s, t) => s + (t.rrRatio ?? 0), 0) / (trades.length || 1)) * 100
          ) / 100,
        averageTrade: Math.round(net / trades.length),
        netPnL: net,
        profitFactor: gl !== 0 ? Math.round((gp / Math.abs(gl)) * 100) / 100 : gp > 0 ? 99 : 0,
      };
    });
}

export const DEMO_CONFIDENCE: ConfidenceBucket[] = groupByConfidence();

export function demoPagination(page: number, limit: number, total: number): Pagination {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  return {
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrevious: page > 1,
  };
}

export const DEMO_PERFORMANCE_COACH: PerformanceCoachResponse = {
  summary:
    "Solid month — a 5.0 profit factor and a clear edge on Breakout and Mean Reversion setups. Trend Following is the one dragging the average down.",
  trajectory: {
    observation: "Net P&L has climbed steadily over the last 7 weeks with only shallow pullbacks.",
    coaching: "Keep sizing consistent through the current streak — don't scale up just because it's working.",
  },
  consistency: {
    observation: "Win rate holds around 67% across every strategy except Trend Following.",
    coaching: "Review the Trend Following entries tagged Revenge/Anxious/Greed — that's where the edge disappears.",
  },
  riskOfRuin: {
    observation: "Max drawdown has stayed under 9% of equity at any point.",
    coaching: "Risk is well controlled — this is a good baseline to keep defending as size increases.",
  },
  strengths: [
    "Breakout setups are converting at an 80% win rate.",
    "Stop-losses are set on every trade without exception.",
  ],
  focusAreas: [
    "Trend Following trades taken on Revenge/Anxious/Greed days are the biggest drag on expectancy.",
    "Consider sizing down or skipping Trend Following setups until confidence is back above 6/10.",
  ],
};

export const DEMO_NEWS: NewsResponse = {
  symbolsCovered: ["RELIANCE", "TCS", "HDFCBANK", "INFY"],
  items: [],
  overallNote: "Sign up and connect your trades to see news for the symbols you actually hold.",
};

export const DEMO_MARKET_NEWS: MarketNewsResponse = {
  items: [
    {
      headline: "Sensex, Nifty open flat as investors await Q1 earnings from top banks",
      source: "Economic Times",
      url: "https://economictimes.indiatimes.com/markets",
      sentiment: "NEUTRAL",
      publishedAt: new Date().toISOString(),
    },
    {
      headline: "FIIs turn net buyers after three-week selloff, infuse ₹4,200 crore",
      source: "Business Standard",
      url: "https://www.business-standard.com/markets",
      sentiment: "POSITIVE",
      publishedAt: new Date().toISOString(),
    },
    {
      headline: "Rupee slips to fresh low against dollar on crude oil price surge",
      source: "Livemint",
      url: "https://www.livemint.com/market",
      sentiment: "NEGATIVE",
      publishedAt: new Date().toISOString(),
    },
    {
      headline: "RBI holds repo rate steady at 6.5%, signals data-dependent stance",
      source: "The Hindu BusinessLine",
      url: "https://www.thehindubusinessline.com/markets",
      sentiment: "NEUTRAL",
      publishedAt: new Date().toISOString(),
    },
  ],
};

export const DEMO_MARKET_INDICES: IndexQuote[] = [
  { symbol: "NIFTY50", name: "NIFTY 50", price: 23767.45, change: -102.15, changePercent: -0.43, asOf: new Date().toISOString() },
  { symbol: "NIFTYNXT50", name: "NIFTY NEXT 50", price: 71766.0, change: -74.45, changePercent: -0.1, asOf: new Date().toISOString() },
  { symbol: "NIFTYFINSRV", name: "NIFTY FIN SERVICE", price: 25909.9, change: -82.15, changePercent: -0.32, asOf: new Date().toISOString() },
  { symbol: "NIFTYBANK", name: "NIFTY BANK", price: 56693.5, change: 101.5, changePercent: 0.18, asOf: new Date().toISOString() },
  { symbol: "NIFTY100", name: "NIFTY 100", price: 24840.75, change: -91.75, changePercent: -0.37, asOf: new Date().toISOString() },
];
