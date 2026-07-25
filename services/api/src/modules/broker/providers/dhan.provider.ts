import { AppError } from "../../../shared/exceptions/AppError.js";
import type { BrokerConnection, BrokerProvider, RawBrokerFill } from "./types.js";

const BASE_URL = "https://api.dhan.co/v2";
const TOKEN_VALIDITY_HOURS = 24;

interface DhanTradeRow {
    exchangeTradeId: string;
    transactionType: "BUY" | "SELL";
    exchangeSegment: string;
    productType: string;
    tradingSymbol: string | null;
    customSymbol: string;
    tradedQuantity: number;
    tradedPrice: number;
    instrument?: string;
    sebiTax?: number;
    stt?: number;
    brokerageCharges?: number;
    serviceTax?: number;
    exchangeTransactionCharges?: number;
    stampDuty?: number;
    exchangeTime: string;
    drvOptionType?: string;
}

function formatDate(date: Date): string {
    return date.toISOString().slice(0, 10);
}

function mapExchangeSegment(
    exchangeSegment: string,
    drvOptionType?: string
): { exchange: string; segment: string } {
    const seg = exchangeSegment.toUpperCase();
    const isOption = Boolean(drvOptionType);

    switch (seg) {
        case "NSE_EQ":
            return { exchange: "NSE", segment: "EQUITY" };
        case "BSE_EQ":
            return { exchange: "BSE", segment: "EQUITY" };
        case "NSE_FNO":
            return {
                exchange: "NFO",
                segment: isOption ? "OPTIONS" : "FUTURES",
            };
        case "BSE_FNO":
            return {
                exchange: "BSE",
                segment: isOption ? "OPTIONS" : "FUTURES",
            };
        case "NSE_CURRENCY":
        case "BSE_CURRENCY":
            return { exchange: "CDS", segment: "CURRENCY" };
        case "MCX_COMM":
            return { exchange: "MCX", segment: "COMMODITY" };
        default:
            return { exchange: "NSE", segment: "EQUITY" };
    }
}

function mapProductType(productType: string): string {
    const product = productType.toUpperCase();

    if (product === "CNC") {
        return "CNC";
    }

    if (product === "INTRADAY") {
        return "MIS";
    }

    return "NRML";
}

function mapFill(row: DhanTradeRow): RawBrokerFill {
    const { exchange, segment } = mapExchangeSegment(
        row.exchangeSegment,
        row.drvOptionType
    );

    const taxes =
        (row.sebiTax ?? 0) +
        (row.stt ?? 0) +
        (row.serviceTax ?? 0) +
        (row.exchangeTransactionCharges ?? 0) +
        (row.stampDuty ?? 0);

    return {
        externalTradeId: row.exchangeTradeId,
        broker: "DHAN",
        symbol: row.tradingSymbol || row.customSymbol,
        side: row.transactionType,
        quantity: row.tradedQuantity,
        price: row.tradedPrice,
        tradeTime: row.exchangeTime,
        segment,
        product: mapProductType(row.productType),
        exchange,
        brokerage: row.brokerageCharges ?? 0,
        taxes,
    };
}

async function dhanRequest(
    path: string,
    accessToken: string
): Promise<unknown> {
    const response = await fetch(`${BASE_URL}${path}`, {
        headers: {
            Accept: "application/json",
            "access-token": accessToken,
        },
    });

    if (!response.ok) {
        throw new AppError(
            `Dhan API request failed (${response.status}).`,
            response.status === 401 || response.status === 403 ? 400 : 502
        );
    }

    return response.json();
}

export const dhanProvider: BrokerProvider = {
    broker: "DHAN",

    async connect(
        credentials: Record<string, string>
    ): Promise<BrokerConnection> {
        const { dhanClientId, accessToken } = credentials;

        if (!dhanClientId || !accessToken) {
            throw new AppError(
                "dhanClientId and accessToken are required to connect a Dhan account.",
                400
            );
        }

        const profile = (await dhanRequest(
            "/profile",
            accessToken
        )) as { dhanClientId?: string };

        if (!profile?.dhanClientId) {
            throw new AppError(
                "Could not verify Dhan credentials — token may be invalid or expired.",
                400
            );
        }

        return {
            brokerUserId: profile.dhanClientId,
            accessToken,
            expiresAt: new Date(
                Date.now() + TOKEN_VALIDITY_HOURS * 60 * 60 * 1000
            ),
        };
    },

    async fetchTrades(
        connection: { accessToken: string },
        range: { fromDate: Date; toDate: Date }
    ): Promise<RawBrokerFill[]> {
        const from = formatDate(range.fromDate);
        const to = formatDate(range.toDate);

        const fills: RawBrokerFill[] = [];

        let page = 0;

        while (true) {
            const rows = (await dhanRequest(
                `/trades/${from}/${to}/${page}`,
                connection.accessToken
            )) as DhanTradeRow[];

            if (!Array.isArray(rows) || rows.length === 0) {
                break;
            }

            fills.push(...rows.map(mapFill));

            page += 1;
        }

        return fills;
    },
};
