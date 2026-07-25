import { prisma } from "../database/prisma.js";
import { createTradeSchema } from "../../modules/trade/validations/trade.validation.js";
import { tradeService } from "../../modules/trade/services/trade.service.js";

export type ImportRow = Record<string, unknown> & {
    symbol: string;
    side: string;
    quantity: number;
    entryTime: string;
    exitTime?: string | null;
    entryPrice: number | string;
};

function toIso(value: string | Date | null | undefined): string {
    if (!value) {
        return "";
    }

    return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

function buildDedupKey(row: {
    symbol: string;
    side: string;
    quantity: number;
    entryTime: string | Date;
    exitTime?: string | Date | null;
    entryPrice: number | string;
}) {
    return [
        row.symbol,
        row.side,
        row.quantity,
        toIso(row.entryTime),
        toIso(row.exitTime),
        Number(row.entryPrice),
    ].join("|");
}

async function findExistingKeyCounts(
    userId: string,
    rows: ImportRow[]
): Promise<Map<string, number>> {
    if (!rows.length) {
        return new Map();
    }

    const symbols = [...new Set(rows.map(row => row.symbol))];

    const existingTrades = await prisma.trade.findMany({
        where: {
            userId,
            deletedAt: null,
            symbol: {
                in: symbols,
            },
        },
        select: {
            symbol: true,
            side: true,
            quantity: true,
            entryTime: true,
            exitTime: true,
            entryPrice: true,
        },
    });

    const counts = new Map<string, number>();

    for (const trade of existingTrades) {
        const key = buildDedupKey(trade);
        counts.set(key, (counts.get(key) ?? 0) + 1);
    }

    return counts;
}

function stripNulls(row: ImportRow): ImportRow {
    const result = { ...row };

    for (const key of Object.keys(result)) {
        if (result[key] === null) {
            delete result[key];
        }
    }

    return result;
}

export async function filterOutDuplicates(
    userId: string,
    rows: ImportRow[]
) {
    const existingCounts = await findExistingKeyCounts(userId, rows);

    const readyRows: ImportRow[] = [];
    let duplicateCount = 0;

    for (const row of rows) {
        const key = buildDedupKey(row);
        const remaining = existingCounts.get(key) ?? 0;

        if (remaining > 0) {
            existingCounts.set(key, remaining - 1);
            duplicateCount++;
            continue;
        }

        readyRows.push(row);
    }

    return {
        readyRows,
        duplicateCount,
    };
}

export async function importTradeRows(userId: string, rows: ImportRow[]) {
    const { readyRows, duplicateCount } = await filterOutDuplicates(
        userId,
        rows
    );

    const imported: unknown[] = [];
    const skippedInvalid: { row: ImportRow; reason: string }[] = [];

    for (const row of readyRows) {
        const parsed = createTradeSchema.safeParse(stripNulls(row));

        if (!parsed.success) {
            skippedInvalid.push({
                row,
                reason: parsed.error.message,
            });
            continue;
        }

        const trade = await tradeService.create(userId, parsed.data);

        imported.push(trade);
    }

    return {
        imported,
        duplicateCount,
        skippedInvalid,
    };
}
