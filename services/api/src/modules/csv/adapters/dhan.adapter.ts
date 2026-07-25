import { parse } from "csv-parse";
import { AppError } from "../../../shared/exceptions/AppError.js";
import type { BrokerAdapter, NormalizedImportRow } from "./types.js";

const TITLE_MARKER = "Realised PnL Report";
const HEADER_MARKER = "Scrip Name";
const DATE_RANGE_PATTERN =
    /From\s+(\d{2})-(\d{2})-(\d{4})\s+to\s+(\d{2})-(\d{2})-(\d{4})/i;

function parseNumber(raw: string | undefined): number | null {
    if (!raw) {
        return null;
    }

    const cleaned = raw.replace(/,/g, "").trim();

    if (!cleaned) {
        return null;
    }

    const value = Number(cleaned);

    return Number.isFinite(value) ? value : null;
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

export const dhanAdapter: BrokerAdapter = {
    async parse(buffer: Buffer): Promise<NormalizedImportRow[]> {
        const rows = await parseRawRows(buffer);

        const titleRow = rows[0];
        const titleText = `${titleRow?.[0] ?? ""} ${titleRow?.[1] ?? ""}`;

        if (!titleText.includes(TITLE_MARKER)) {
            throw new AppError(
                "This doesn't look like a Dhan Realised P&L Report — expected a title row containing " +
                    `"${TITLE_MARKER}". Download it from Dhan's web app under Reports > P&L Statement.`,
                400
            );
        }

        const dateMatch = titleText.match(DATE_RANGE_PATTERN);

        if (!dateMatch) {
            throw new AppError(
                "Could not read the report's date range from its title row — expected " +
                    '"From DD-MM-YYYY to DD-MM-YYYY".',
                400
            );
        }

        const [, , , , endDay, endMonth, endYear] = dateMatch;
        const reportEndDate = new Date(
            Number(endYear),
            Number(endMonth) - 1,
            Number(endDay)
        );

        const headerIndex = rows.findIndex((row) => row[0] === HEADER_MARKER);

        if (headerIndex === -1) {
            throw new AppError(
                `Could not find the "${HEADER_MARKER}" header row in this Dhan report.`,
                400
            );
        }

        const dateLabel = `${endDay}-${endMonth}-${endYear}`;
        const result: NormalizedImportRow[] = [];

        for (const row of rows.slice(headerIndex + 1)) {
            const [scripName, quantityRaw, avgBuyPriceRaw, , avgSellPriceRaw] =
                row;

            if (!scripName) {
                break;
            }

            const quantity = parseNumber(quantityRaw);
            const avgBuyPrice = parseNumber(avgBuyPriceRaw);
            const avgSellPrice = parseNumber(avgSellPriceRaw);

            if (!quantity || quantity <= 0 || !avgBuyPrice || avgBuyPrice <= 0) {
                continue;
            }

            const hasExit = avgSellPrice !== null && avgSellPrice > 0;

            result.push({
                symbol: scripName,
                segment: "EQUITY",
                product: "CNC",
                side: "BUY",
                quantity,
                entryPrice: avgBuyPrice,
                exitPrice: hasExit ? avgSellPrice : null,
                entryTime: reportEndDate.toISOString(),
                exitTime: hasExit ? reportEndDate.toISOString() : null,
                stopLoss: null,
                target: null,
                brokerage: 0,
                taxes: 0,
                confidence: null,
                exchange: "NSE",
                broker: "DHAN",
                tradeNotes:
                    "Imported from Dhan's Realised P&L summary report — this is an aggregate " +
                    `over the report's full date range, not a single dated trade. The date shown ` +
                    `(${dateLabel}) is a placeholder (the report's end date), not the real entry/exit ` +
                    "date. Please edit this trade with the real date and price details if known." +
                    (hasExit
                        ? ""
                        : " No sell price was found in the report for this symbol, so it was imported without an exit."),
            });
        }

        return result;
    },
};
