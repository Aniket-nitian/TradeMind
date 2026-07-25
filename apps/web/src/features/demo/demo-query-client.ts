import { QueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/lib/api/query-keys";
import type { Paginated } from "@/lib/api/types";
import type { Trade } from "@/features/trades/types";
import {
  DEMO_BROKER_PERFORMANCE,
  DEMO_CALENDAR,
  DEMO_CONFIDENCE,
  DEMO_DRAWDOWN,
  DEMO_EQUITY_CURVE,
  DEMO_MARKET_INDICES,
  DEMO_MARKET_NEWS,
  DEMO_NEWS,
  DEMO_OVERVIEW,
  DEMO_PERFORMANCE_COACH,
  DEMO_PSYCHOLOGY_PERFORMANCE,
  DEMO_STRATEGIES,
  DEMO_STRATEGY_PERFORMANCE,
  DEMO_TRADES,
  DEMO_WIN_LOSS,
  demoPagination,
} from "./fixtures";

function paginatedTrades(page: number, limit: number): Paginated<Trade> {
  const start = (page - 1) * limit;
  return {
    trades: DEMO_TRADES.slice(start, start + limit),
    pagination: demoPagination(page, limit, DEMO_TRADES.length),
  };
}

export function createDemoQueryClient() {
  const client = new QueryClient({
    defaultOptions: {
      queries: {
        enabled: false,
        retry: false,
        staleTime: Infinity,
      },
    },
  });

  client.setQueryData(queryKeys.dashboard.overview, DEMO_OVERVIEW);
  client.setQueryData(queryKeys.dashboard.equityCurve, DEMO_EQUITY_CURVE);
  client.setQueryData(queryKeys.analytics.drawdown, DEMO_DRAWDOWN);
  client.setQueryData(queryKeys.analytics.winLoss, DEMO_WIN_LOSS);
  client.setQueryData(queryKeys.analytics.strategies, DEMO_STRATEGY_PERFORMANCE);
  client.setQueryData(queryKeys.analytics.brokers, DEMO_BROKER_PERFORMANCE);
  client.setQueryData(queryKeys.analytics.psychology, DEMO_PSYCHOLOGY_PERFORMANCE);
  client.setQueryData(queryKeys.analytics.calendar, DEMO_CALENDAR);
  client.setQueryData(queryKeys.analytics.confidence, DEMO_CONFIDENCE);

  client.setQueryData(queryKeys.trades.list({ page: 1, limit: 50 }), paginatedTrades(1, 50));
  client.setQueryData(queryKeys.trades.list({ page: 1, limit: 20 }), paginatedTrades(1, 20));

  client.setQueryData(queryKeys.strategies.list, DEMO_STRATEGIES);
  client.setQueryData(queryKeys.broker.accounts, []);
  client.setQueryData(queryKeys.performanceCoach.root, DEMO_PERFORMANCE_COACH);
  client.setQueryData(queryKeys.news.root, DEMO_NEWS);
  client.setQueryData(queryKeys.news.market, DEMO_MARKET_NEWS);
  client.setQueryData(queryKeys.market.indices, DEMO_MARKET_INDICES);
  client.setQueryData(queryKeys.notifications.list({ limit: 10 }), {
    notifications: [],
    unreadCount: 0,
  });

  return client;
}
