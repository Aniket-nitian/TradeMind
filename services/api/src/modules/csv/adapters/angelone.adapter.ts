import { parseCsv } from "../utils/csvParser.js";
import { matchFillsToTrades } from "../../broker/utils/position-matcher.js";
import type { RawBrokerFill } from "../../broker/providers/types.js";
import type { BrokerAdapter, NormalizedImportRow } from "./types.js";

interface AngelOneRow {
    tradingsymbol?: string;
    exchange?: string;
    producttype?: string;
    transactiontype?: string;
    fillsize?: string;
    fillprice?: string;
    filltime?: string;
}

function isOption(symbol: string): boolean {
    return /(CE|PE)$/.test(symbol.trim().toUpperCase());
}

function mapExchange(
    exchange: string,
    symbol: string
): { exchange: string; segment: string } {
    const ex = exchange.trim().toUpperCase();

    if (ex === "NFO") {
        return {
            exchange: "NFO",
            segment: isOption(symbol) ? "OPTIONS" : "FUTURES",
        };
    }

    if (ex === "CDS") {
        return { exchange: "CDS", segment: "CURRENCY" };
    }

    if (ex === "MCX") {
        return { exchange: "MCX", segment: "COMMODITY" };
    }

    if (ex === "BSE") {
        return { exchange: "BSE", segment: "EQUITY" };
    }

    return { exchange: "NSE", segment: "EQUITY" };
}

function mapProduct(productType: string): string {
    const product = productType.trim().toUpperCase();

    if (product === "DELIVERY" || product === "CNC") {
        return "CNC";
    }

    if (product === "INTRADAY") {
        return "MIS";
    }

    return "NRML";
}

export const angelOneAdapter: BrokerAdapter = {
    async parse(buffer: Buffer): Promise<NormalizedImportRow[]> {
        const rows = (await parseCsv(buffer)) as AngelOneRow[];

        const fills: RawBrokerFill[] = rows
            .filter(row => row.tradingsymbol && row.transactiontype)
            .map((row, index) => {
                const symbol = (row.tradingsymbol || "").trim();
                const { exchange, segment } = mapExchange(
                    row.exchange || "",
                    symbol
                );

                return {
                    externalTradeId: String(index),
                    broker: "ANGEL_ONE",
                    symbol,
                    side: (row.transactiontype || "")
                        .trim()
                        .toUpperCase() as "BUY" | "SELL",
                    quantity: Number(row.fillsize),
                    price: Number(row.fillprice),
                    tradeTime: new Date(row.filltime || "").toISOString(),
                    segment,
                    product: mapProduct(row.producttype || ""),
                    exchange,
                    brokerage: 0,
                    taxes: 0,
                };
            });

        return matchFillsToTrades(fills);
    },
};
