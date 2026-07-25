import { parseCsv } from "../utils/csvParser.js";
import { matchFillsToTrades } from "../../broker/utils/position-matcher.js";
import type { RawBrokerFill } from "../../broker/providers/types.js";
import type { BrokerAdapter, NormalizedImportRow } from "./types.js";

interface FyersRow {
    Name?: string;
    "Date and time"?: string;
    Side?: string;
    "Product type"?: string;
    Qty?: string;
    "Traded price"?: string;
    Segment?: string;
}

function isOption(symbol: string): boolean {
    return /(CE|PE)$/.test(symbol.trim().toUpperCase());
}

function mapSegment(
    segment: string,
    symbol: string
): { exchange: string; segment: string } {
    const seg = segment.trim().toUpperCase();

    if (seg.includes("FO")) {
        const exchange = seg.includes("BSE") ? "BSE" : "NFO";

        return {
            exchange,
            segment: isOption(symbol) ? "OPTIONS" : "FUTURES",
        };
    }

    if (seg.includes("CD") || seg.includes("CUR")) {
        return { exchange: "CDS", segment: "CURRENCY" };
    }

    if (seg.includes("MCX") || seg.includes("COM")) {
        return { exchange: "MCX", segment: "COMMODITY" };
    }

    return {
        exchange: seg.includes("BSE") ? "BSE" : "NSE",
        segment: "EQUITY",
    };
}

function mapProduct(productType: string): string {
    const product = productType.trim().toUpperCase();

    if (product === "CNC") {
        return "CNC";
    }

    if (product === "INTRADAY") {
        return "MIS";
    }

    return "NRML";
}

export const fyersAdapter: BrokerAdapter = {
    async parse(buffer: Buffer): Promise<NormalizedImportRow[]> {
        const rows = (await parseCsv(buffer)) as FyersRow[];

        const fills: RawBrokerFill[] = rows.map((row, index) => {
            const symbol = (row.Name || "").trim();
            const { exchange, segment } = mapSegment(
                row.Segment || "",
                symbol
            );

            return {
                externalTradeId: String(index),
                broker: "FYERS",
                symbol,
                side: (row.Side || "").trim().toUpperCase() as
                    | "BUY"
                    | "SELL",
                quantity: Number(row.Qty),
                price: Number(row["Traded price"]),
                tradeTime: new Date(
                    row["Date and time"] || ""
                ).toISOString(),
                segment,
                product: mapProduct(row["Product type"] || ""),
                exchange,
                brokerage: 0,
                taxes: 0,
            };
        });

        return matchFillsToTrades(fills);
    },
};
