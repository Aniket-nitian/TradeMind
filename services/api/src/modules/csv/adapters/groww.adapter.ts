import { parse } from "csv-parse";
import type { BrokerAdapter, NormalizedImportRow } from "./types.js";
import { isXlsxBuffer, parseXlsxSheet } from "../utils/xlsxParser.js";

const MONTHS: Record<string, number> = {
    JAN: 0,
    FEB: 1,
    MAR: 2,
    APR: 3,
    MAY: 4,
    JUN: 5,
    JUL: 6,
    AUG: 7,
    SEP: 8,
    OCT: 9,
    NOV: 10,
    DEC: 11,
};

const SECTION_HEADERS = new Set(["Futures", "Options"]);
const SUB_HEADER_MARKER = "Scrip Name";
const TERMINATOR_MARKER = "Disclaimer:";

function parseGrowwDate(value: string): Date {
    const [day, monthLabel, year] = value.trim().split(/\s+/);

    const month = MONTHS[monthLabel.toUpperCase()];

    return new Date(Number(year), month, Number(day));
}

function parseRawRows(buffer: Buffer): Promise<string[][]> {
    return new Promise((resolve, reject) => {
        parse(
            buffer,
            {
                columns: false,
                skip_empty_lines: false,
                trim: true,
                relax_column_count: true,
            },
            (err, records) => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve(records);
            }
        );
    });
}

function processRows(rows: string[][]): NormalizedImportRow[] {
    const result: NormalizedImportRow[] = [];

    let pendingSegment: "FUTURES" | "OPTIONS" | null = null;
    let currentSegment: "FUTURES" | "OPTIONS" | null = null;

    for (const row of rows) {
        const first = (row[0] ?? "").trim();

        if (!first) {
            currentSegment = null;
            continue;
        }

        if (SECTION_HEADERS.has(first)) {
            pendingSegment = first.toUpperCase() as "FUTURES" | "OPTIONS";
            continue;
        }

        if (first === SUB_HEADER_MARKER) {
            if (pendingSegment) {
                currentSegment = pendingSegment;
                pendingSegment = null;
            }
            continue;
        }

        if (first.startsWith(TERMINATOR_MARKER)) {
            break;
        }

        pendingSegment = null;

        if (!currentSegment) {
            continue;
        }

        const [
            scripName,
            quantityRaw,
            buyDateRaw,
            buyPriceRaw,
            ,
            sellDateRaw,
            sellPriceRaw,
        ] = row;

        if (!scripName || !quantityRaw || !buyDateRaw || !sellDateRaw) {
            continue;
        }

        const quantity = Number(quantityRaw);
        const buyDate = parseGrowwDate(buyDateRaw);
        const sellDate = parseGrowwDate(sellDateRaw);
        const buyPrice = Number(buyPriceRaw);
        const sellPrice = Number(sellPriceRaw);

        const isLong = buyDate.getTime() <= sellDate.getTime();

        result.push({
            symbol: scripName,
            segment: currentSegment,
            product: "NRML",
            side: isLong ? "BUY" : "SELL",
            quantity,
            entryPrice: isLong ? buyPrice : sellPrice,
            exitPrice: isLong ? sellPrice : buyPrice,
            entryTime: (isLong ? buyDate : sellDate).toISOString(),
            exitTime: (isLong ? sellDate : buyDate).toISOString(),
            stopLoss: null,
            target: null,
            brokerage: 0,
            taxes: 0,
            confidence: null,
            exchange: "NFO",
            broker: "GROWW",
        });
    }

    return result;
}

export const growwAdapter: BrokerAdapter = {
    async parse(buffer: Buffer): Promise<NormalizedImportRow[]> {
        const rows = isXlsxBuffer(buffer)
            ? await parseXlsxSheet(buffer, "Trade Level")
            : await parseRawRows(buffer);

        return processRows(rows);
    },
};
