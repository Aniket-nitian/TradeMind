import { parseCsv } from "../utils/csvParser.js";
import { matchFillsToTrades } from "../../broker/utils/position-matcher.js";
import type { RawBrokerFill } from "../../broker/providers/types.js";
import type { BrokerAdapter, NormalizedImportRow } from "./types.js";

interface ZerodhaRow {
    tradingsymbol?: string;
    symbol?: string;
    exchange?: string;
    segment?: string;
    trade_type?: string;
    quantity?: string;
    price?: string;
    trade_date?: string;
    order_execution_time?: string;
}

function isOption(symbol: string): boolean {
    return /(CE|PE)$/.test(symbol.trim().toUpperCase());
}

function mapSegment(
    segment: string,
    symbol: string
): { exchange: string; segment: string } {
    const seg = segment.trim().toUpperCase();

    if (seg === "EQ") {
        return { exchange: "NSE", segment: "EQUITY" };
    }

    if (seg === "FO") {
        return {
            exchange: "NFO",
            segment: isOption(symbol) ? "OPTIONS" : "FUTURES",
        };
    }

    if (seg === "CD") {
        return { exchange: "CDS", segment: "CURRENCY" };
    }

    if (seg === "COM" || seg === "MCX") {
        return { exchange: "MCX", segment: "COMMODITY" };
    }

    return { exchange: "NSE", segment: "EQUITY" };
}

function mapProduct(segment: string): string {
    return segment === "EQUITY" ? "CNC" : "NRML";
}

export const zerodhaAdapter: BrokerAdapter = {
    async parse(buffer: Buffer): Promise<NormalizedImportRow[]> {
        const rows = (await parseCsv(buffer)) as ZerodhaRow[];

        const fills: RawBrokerFill[] = rows.map((row, index) => {
            const symbol = (row.tradingsymbol || row.symbol || "").trim();
            const { exchange, segment } = mapSegment(
                row.segment || "",
                symbol
            );

            return {
                externalTradeId: String(index),
                broker: "ZERODHA",
                symbol,
                side: (row.trade_type || "").trim().toUpperCase() as
                    | "BUY"
                    | "SELL",
                quantity: Number(row.quantity),
                price: Number(row.price),
                tradeTime: new Date(
                    row.order_execution_time || row.trade_date || ""
                ).toISOString(),
                segment,
                product: mapProduct(segment),
                exchange,
                brokerage: 0,
                taxes: 0,
            };
        });

        return matchFillsToTrades(fills);
    },
};
