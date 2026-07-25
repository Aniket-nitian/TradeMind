
interface TrackedIndex {
  symbol: string;
  yahooSymbol: string;
}

const TRACKED_INDICES: TrackedIndex[] = [
  { symbol: "NIFTY_50", yahooSymbol: "^NSEI" },
  { symbol: "NIFTY_NEXT_50", yahooSymbol: "^NSMIDCP" },
  { symbol: "NIFTY_FIN_SERVICE", yahooSymbol: "NIFTY_FIN_SERVICE.NS" },
  { symbol: "NIFTY_BANK", yahooSymbol: "^NSEBANK" },
  { symbol: "NIFTY_100", yahooSymbol: "^CNX100" },
];

export interface IndexQuote {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  asOf: string;
}

export interface StockQuote {
  price: number;
  change: number;
  changePercent: number;
  asOf: string;
}

interface QuoteRequest {
  symbol: string;
  exchange?: string | null;
}

interface RawQuote {
  name?: string;
  price: number;
  change: number;
  changePercent: number;
  asOf: string;
}

interface YahooChartResponse {
  chart: {
    result:
      | [
          {
            meta: {
              symbol: string;
              shortName?: string;
              longName?: string;
              regularMarketPrice: number;
              chartPreviousClose: number;
              regularMarketTime: number;
            };
          },
        ]
      | null;
    error: unknown;
  };
}

const CACHE_TTL_MS = 60_000;
const STOCK_CACHE_TTL_MS = 60_000;
const FETCH_TIMEOUT_MS = 6_000;

let cache: { data: IndexQuote[]; expiresAt: number } | null = null;
let inFlight: Promise<IndexQuote[]> | null = null;

const stockCache = new Map<string, { data: StockQuote; expiresAt: number }>();

function toYahooEquitySymbol(symbol: string, exchange?: string | null): string {
  const suffix = exchange === "BSE" ? ".BO" : ".NS";
  return `${symbol}${suffix}`;
}

async function fetchYahooQuote(yahooSymbol: string): Promise<RawQuote | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(
      yahooSymbol
    )}?interval=1d&range=1d`;

    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    if (!res.ok) return null;

    const body = (await res.json()) as YahooChartResponse;
    const result = body.chart.result?.[0];
    if (!result) return null;

    const { meta } = result;
    const price = meta.regularMarketPrice;
    const prevClose = meta.chartPreviousClose;

    if (typeof price !== "number" || typeof prevClose !== "number") {
      return null;
    }

    const change = price - prevClose;
    const changePercent = prevClose !== 0 ? (change / prevClose) * 100 : 0;

    return {
      name: meta.shortName ?? meta.longName,
      price: Number(price.toFixed(2)),
      change: Number(change.toFixed(2)),
      changePercent: Number(changePercent.toFixed(2)),
      asOf: new Date(meta.regularMarketTime * 1000).toISOString(),
    };
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchOne(index: TrackedIndex): Promise<IndexQuote | null> {
  const quote = await fetchYahooQuote(index.yahooSymbol);
  if (!quote) return null;

  return {
    symbol: index.symbol,
    name: quote.name ?? index.symbol,
    price: quote.price,
    change: quote.change,
    changePercent: quote.changePercent,
    asOf: quote.asOf,
  };
}

async function fetchAll(): Promise<IndexQuote[]> {
  const settled = await Promise.all(TRACKED_INDICES.map(fetchOne));
  return settled.filter((quote): quote is IndexQuote => quote !== null);
}

export class MarketService {
  async getIndices(): Promise<IndexQuote[]> {
    const now = Date.now();

    if (cache && cache.expiresAt > now) {
      return cache.data;
    }

    if (!inFlight) {
      inFlight = fetchAll().finally(() => {
        inFlight = null;
      });
    }

    const data = await inFlight;

    if (data.length > 0) {
      cache = { data, expiresAt: now + CACHE_TTL_MS };
    }

    return data;
  }

  async getQuotes(requests: QuoteRequest[]): Promise<Map<string, StockQuote>> {
    const now = Date.now();
    const result = new Map<string, StockQuote>();
    const toFetch: { symbol: string; yahooSymbol: string }[] = [];

    for (const req of requests) {
      const yahooSymbol = toYahooEquitySymbol(req.symbol, req.exchange);
      const cached = stockCache.get(yahooSymbol);

      if (cached && cached.expiresAt > now) {
        result.set(req.symbol, cached.data);
      } else {
        toFetch.push({ symbol: req.symbol, yahooSymbol });
      }
    }

    await Promise.all(
      toFetch.map(async ({ symbol, yahooSymbol }) => {
        const quote = await fetchYahooQuote(yahooSymbol);
        if (!quote) return;

        const data: StockQuote = {
          price: quote.price,
          change: quote.change,
          changePercent: quote.changePercent,
          asOf: quote.asOf,
        };

        stockCache.set(yahooSymbol, { data, expiresAt: now + STOCK_CACHE_TTL_MS });
        result.set(symbol, data);
      })
    );

    return result;
  }
}

export const marketService = new MarketService();
