import { createHash } from "crypto";
import { generateSync as generateTotp } from "otplib";

import { AppError } from "../../../shared/exceptions/AppError.js";
import type { BrokerConnection, BrokerProvider, RawBrokerFill } from "./types.js";

const BASE_URL = "https://api.groww.in";

interface GrowwRefreshPayload {
  type: "approval" | "totp";
  secret: string;
  apiKey: string;
}

interface GrowwTokenResponse {
  token?: string;
  tokenRefId?: string;
  sessionName?: string;
  expiry?: string;
  isActive?: boolean;
}

interface GrowwOrderRow {
  groww_order_id: string;
  trading_symbol: string;
  transaction_type: "BUY" | "SELL";
  segment: string;
  product: string;
  exchange: string;
  trade_date?: string;
  created_at?: string;
}

interface GrowwTradeRow {
  groww_order_id: string;
  groww_trade_id: string;
  price: number;
  quantity: number;
  trading_symbol: string;
  segment: string;
  product: string;
  exchange: string;
  trade_date_time: string;
}

function computeApprovalChecksum(apiSecret: string, timestamp: string): string {
  return createHash("sha256").update(apiSecret + timestamp).digest("hex");
}

async function exchangeToken(
  apiKey: string,
  body: Record<string, string>
): Promise<{ accessToken: string; expiresAt: Date }> {
  const response = await fetch(`${BASE_URL}/v1/token/api/access`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new AppError(
      `Groww token exchange failed (${response.status}). If you connected using the API-secret method, remember Groww requires re-approving access once a day on their own dashboard.`,
      response.status === 401 || response.status === 403 ? 400 : 502
    );
  }

  const data = (await response.json()) as GrowwTokenResponse;

  if (!data.token) {
    throw new AppError("Groww token exchange did not return a usable token.", 400);
  }

  const parsedExpiry = data.expiry ? new Date(data.expiry) : null;
  const expiresAt =
    parsedExpiry && !Number.isNaN(parsedExpiry.getTime())
      ? parsedExpiry
      : new Date(Date.now() + 12 * 60 * 60 * 1000);

  return { accessToken: data.token, expiresAt };
}

async function growwRequest(path: string, accessToken: string): Promise<unknown> {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
      "X-API-VERSION": "1.0",
    },
  });

  if (!response.ok) {
    throw new AppError(
      `Groww API request failed (${response.status}).`,
      response.status === 401 || response.status === 403 ? 400 : 502
    );
  }

  return response.json();
}

function mapSegment(segment: string): { exchange: string; segment: string } {
  const seg = segment.toUpperCase();

  switch (seg) {
    case "CASH":
      return { exchange: "NSE", segment: "EQUITY" };
    case "FNO":
      return { exchange: "NFO", segment: "FUTURES" };
    case "COMMODITY":
      return { exchange: "MCX", segment: "COMMODITY" };
    case "CURRENCY":
      return { exchange: "CDS", segment: "CURRENCY" };
    default:
      return { exchange: "NSE", segment: "EQUITY" };
  }
}

function mapProduct(product: string): string {
  const p = product.toUpperCase();
  if (p === "CNC" || p === "MIS" || p === "NRML") return p;
  return "NRML";
}

function mapFill(row: GrowwTradeRow, order: GrowwOrderRow | undefined): RawBrokerFill {
  const { exchange, segment } = mapSegment(row.segment ?? order?.segment ?? "CASH");

  return {
    externalTradeId: row.groww_trade_id,
    broker: "GROWW",
    symbol: row.trading_symbol,
    side: order?.transaction_type ?? "BUY",
    quantity: row.quantity,
    price: row.price,
    tradeTime: row.trade_date_time,
    segment,
    product: mapProduct(row.product ?? order?.product ?? "CNC"),
    exchange: row.exchange || exchange,
    brokerage: 0,
    taxes: 0,
  };
}

export const growwProvider: BrokerProvider = {
  broker: "GROWW",

  async connect(credentials: Record<string, string>): Promise<BrokerConnection> {
    const { apiKey, apiSecret, totpSecret } = credentials;

    if (!apiKey) {
      throw new AppError("apiKey is required to connect a Groww account.", 400);
    }

    if (!apiSecret && !totpSecret) {
      throw new AppError(
        "Either apiSecret or totpSecret is required to connect a Groww account.",
        400
      );
    }

    let exchanged: { accessToken: string; expiresAt: Date };
    let refresh: GrowwRefreshPayload;

    if (totpSecret) {
      const totp = generateTotp({ secret: totpSecret });
      exchanged = await exchangeToken(apiKey, { key_type: "totp", totp });
      refresh = { type: "totp", secret: totpSecret, apiKey };
    } else {
      const timestamp = String(Math.floor(Date.now() / 1000));
      const checksum = computeApprovalChecksum(apiSecret!, timestamp);
      exchanged = await exchangeToken(apiKey, {
        key_type: "approval",
        checksum,
        timestamp,
      });
      refresh = { type: "approval", secret: apiSecret!, apiKey };
    }

    const brokerUserId = createHash("sha256").update(apiKey).digest("hex").slice(0, 16);

    return {
      brokerUserId,
      accessToken: exchanged.accessToken,
      expiresAt: exchanged.expiresAt,
      refreshPayload: JSON.stringify(refresh),
    };
  },

  async fetchTrades(
    connection: { accessToken: string },
    range: { fromDate: Date; toDate: Date }
  ): Promise<RawBrokerFill[]> {
    const fills: RawBrokerFill[] = [];
    let page = 0;

    const orders: GrowwOrderRow[] = [];

    while (true) {
      const body = (await growwRequest(
        `/v1/order/list?segment=CASH&page=${page}&page_size=100`,
        connection.accessToken
      )) as { payload?: { order_list?: GrowwOrderRow[] } };

      const rows = body.payload?.order_list ?? [];
      if (rows.length === 0) break;

      orders.push(...rows);
      page += 1;

      if (rows.length < 100) break;
    }

    const inRange = orders.filter((order) => {
      const t = order.trade_date ?? order.created_at;
      if (!t) return true;
      const time = new Date(t).getTime();
      return time >= range.fromDate.getTime() && time <= range.toDate.getTime();
    });

    for (const order of inRange) {
      let tradePage = 0;

      while (true) {
        const body = (await growwRequest(
          `/v1/order/trades/${order.groww_order_id}?segment=CASH&page=${tradePage}&page_size=50`,
          connection.accessToken
        )) as { payload?: { trade_list?: GrowwTradeRow[] } };

        const rows = body.payload?.trade_list ?? [];
        if (rows.length === 0) break;

        fills.push(...rows.map((row) => mapFill(row, order)));
        tradePage += 1;

        if (rows.length < 50) break;
      }
    }

    return fills;
  },

  async renewToken(connection: {
    accessToken: string;
    refreshToken?: string;
  }): Promise<{ accessToken: string; expiresAt: Date }> {
    if (!connection.refreshToken) {
      throw new AppError("No stored Groww refresh secret to renew with.", 400);
    }

    const refresh = JSON.parse(connection.refreshToken) as GrowwRefreshPayload;

    if (refresh.type === "totp") {
      const totp = generateTotp({ secret: refresh.secret });
      return exchangeToken(refresh.apiKey, { key_type: "totp", totp });
    }

    const timestamp = String(Math.floor(Date.now() / 1000));
    const checksum = computeApprovalChecksum(refresh.secret, timestamp);
    return exchangeToken(refresh.apiKey, {
      key_type: "approval",
      checksum,
      timestamp,
    });
  },
};
