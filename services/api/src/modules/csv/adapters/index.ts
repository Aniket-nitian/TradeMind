import { genericAdapter } from "./generic.adapter.js";
import { growwAdapter } from "./groww.adapter.js";
import { zerodhaAdapter } from "./zerodha.adapter.js";
import { fyersAdapter } from "./fyers.adapter.js";
import { angelOneAdapter } from "./angelone.adapter.js";
import { dhanAdapter } from "./dhan.adapter.js";
import { isXlsxBuffer } from "../utils/xlsxParser.js";
import type { BrokerAdapter } from "./types.js";

const registry: Record<string, BrokerAdapter> = {
    GROWW: growwAdapter,
    ZERODHA: zerodhaAdapter,
    FYERS: fyersAdapter,
    ANGEL_ONE: angelOneAdapter,
    DHAN: dhanAdapter,
};

export function resolveAdapter(broker?: string): BrokerAdapter {
    if (!broker) {
        return genericAdapter;
    }

    return registry[broker.toUpperCase()] ?? genericAdapter;
}

export function detectBroker(buffer: Buffer): string | undefined {
    if (isXlsxBuffer(buffer)) {
        return "GROWW";
    }

    const preview = buffer.subarray(0, 4096).toString("utf8");

    if (preview.includes("Realised PnL Report")) {
        return "DHAN";
    }

    if (
        preview.includes("Scrip Name") &&
        (preview.includes("Buy Date") ||
            preview.includes("P&L Statement for Futures"))
    ) {
        return "GROWW";
    }

    if (
        preview.includes("tradingsymbol") &&
        preview.includes("trade_type") &&
        preview.includes("order_execution_time")
    ) {
        return "ZERODHA";
    }

    if (
        preview.includes("Traded price") &&
        preview.includes("Date and time")
    ) {
        return "FYERS";
    }

    if (
        preview.includes("tradingsymbol") &&
        preview.includes("transactiontype") &&
        preview.includes("fillsize")
    ) {
        return "ANGEL_ONE";
    }

    return undefined;
}

export type { BrokerAdapter, NormalizedImportRow } from "./types.js";
