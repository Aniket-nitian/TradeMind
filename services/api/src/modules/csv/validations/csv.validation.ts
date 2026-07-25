import { z } from "zod";

const SIDES = ["BUY", "SELL"];

const SEGMENTS = [
    "EQUITY",
    "FUTURES",
    "OPTIONS",
    "CURRENCY",
    "COMMODITY",
];

const PRODUCTS = [
    "CNC",
    "MIS",
    "NRML",
];

export interface CsvValidationError {
    row: number;
    field: string;
    message: string;
}

export interface CsvValidationResult {
    validRows: any[];
    invalidRows: CsvValidationError[];
}

export function validateTrades(rows: any[]): CsvValidationResult {
    const validRows: any[] = [];
    const invalidRows: CsvValidationError[] = [];

    rows.forEach((row, index) => {
        const rowNo = index + 2;

        if (!row.symbol) {
            invalidRows.push({
                row: rowNo,
                field: "symbol",
                message: "Symbol is required",
            });
            return;
        }

        if (!SIDES.includes(String(row.side).toUpperCase())) {
            invalidRows.push({
                row: rowNo,
                field: "side",
                message: "BUY or SELL expected",
            });
            return;
        }

        if (!SEGMENTS.includes(String(row.segment).toUpperCase())) {
            invalidRows.push({
                row: rowNo,
                field: "segment",
                message: "Invalid segment",
            });
            return;
        }

        if (!PRODUCTS.includes(String(row.product).toUpperCase())) {
            invalidRows.push({
                row: rowNo,
                field: "product",
                message: "Invalid product",
            });
            return;
        }

        if (Number(row.quantity) <= 0) {
            invalidRows.push({
                row: rowNo,
                field: "quantity",
                message: "Quantity must be greater than zero",
            });
            return;
        }

        if (Number(row.entryPrice) <= 0) {
            invalidRows.push({
                row: rowNo,
                field: "entryPrice",
                message: "Entry price must be greater than zero",
            });
            return;
        }

        if (
            row.exitPrice &&
            Number(row.exitPrice) < 0
        ) {
            invalidRows.push({
                row: rowNo,
                field: "exitPrice",
                message: "Exit price cannot be negative",
            });
            return;
        }

        if (!Date.parse(row.entryTime)) {
            invalidRows.push({
                row: rowNo,
                field: "entryTime",
                message: "Invalid entry time",
            });
            return;
        }

        if (
            row.exitTime &&
            !Date.parse(row.exitTime)
        ) {
            invalidRows.push({
                row: rowNo,
                field: "exitTime",
                message: "Invalid exit time",
            });
            return;
        }

        validRows.push({
            ...row,
            quantity: Number(row.quantity),
            entryPrice: Number(row.entryPrice),
            exitPrice: row.exitPrice
                ? Number(row.exitPrice)
                : null,
            stopLoss: row.stopLoss
                ? Number(row.stopLoss)
                : null,
            target: row.target
                ? Number(row.target)
                : null,
            brokerage: row.brokerage
                ? Number(row.brokerage)
                : 0,
            taxes: row.taxes
                ? Number(row.taxes)
                : 0,
            confidence: row.confidence
                ? Number(row.confidence)
                : null,
            side: row.side.toUpperCase(),
            segment: row.segment.toUpperCase(),
            product: row.product.toUpperCase(),
        });
    });

    return {
        validRows,
        invalidRows,
    };
}

export const uploadBrokerSchema = z.object({
    broker: z.string().trim().min(1).optional(),
});

export const importHistoryQuerySchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
});