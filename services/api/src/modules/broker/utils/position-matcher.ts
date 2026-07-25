import type { RawBrokerFill } from "../providers/types.js";
import type { NormalizedTradeRow } from "../../../shared/types/trade-import.js";

interface OpenLot {
    side: "BUY" | "SELL";
    price: number;
    time: string;
    remainingQty: number;
    brokeragePerUnit: number;
    taxesPerUnit: number;
}

function groupKey(fill: RawBrokerFill): string {
    return `${fill.symbol}|${fill.segment}|${fill.product}|${fill.exchange ?? ""}`;
}

export function matchFillsToTrades(
    fills: RawBrokerFill[]
): NormalizedTradeRow[] {
    const groups = new Map<string, RawBrokerFill[]>();

    for (const fill of fills) {
        const key = groupKey(fill);
        const group = groups.get(key) ?? [];

        group.push(fill);
        groups.set(key, group);
    }

    const rows: NormalizedTradeRow[] = [];

    for (const groupFills of groups.values()) {
        const sorted = [...groupFills].sort(
            (a, b) =>
                new Date(a.tradeTime).getTime() -
                new Date(b.tradeTime).getTime()
        );

        const queue: OpenLot[] = [];

        for (const fill of sorted) {
            const direction = queue[0]?.side;

            if (!direction || fill.side === direction) {
                queue.push({
                    side: fill.side,
                    price: fill.price,
                    time: fill.tradeTime,
                    remainingQty: fill.quantity,
                    brokeragePerUnit: fill.brokerage / fill.quantity,
                    taxesPerUnit: fill.taxes / fill.quantity,
                });
                continue;
            }

            let remaining = fill.quantity;
            const closeBrokeragePerUnit = fill.brokerage / fill.quantity;
            const closeTaxesPerUnit = fill.taxes / fill.quantity;

            while (remaining > 0 && queue.length > 0) {
                const lot = queue[0];
                const matchQty = Math.min(remaining, lot.remainingQty);

                rows.push({
                    symbol: fill.symbol,
                    segment: fill.segment,
                    product: fill.product,
                    side: lot.side,
                    quantity: matchQty,
                    entryPrice: lot.price,
                    exitPrice: fill.price,
                    entryTime: lot.time,
                    exitTime: fill.tradeTime,
                    brokerage:
                        lot.brokeragePerUnit * matchQty +
                        closeBrokeragePerUnit * matchQty,
                    taxes:
                        lot.taxesPerUnit * matchQty +
                        closeTaxesPerUnit * matchQty,
                    stopLoss: null,
                    target: null,
                    confidence: null,
                    exchange: fill.exchange,
                    broker: fill.broker,
                });

                lot.remainingQty -= matchQty;
                remaining -= matchQty;

                if (lot.remainingQty === 0) {
                    queue.shift();
                }
            }

            if (remaining > 0) {
                queue.push({
                    side: fill.side,
                    price: fill.price,
                    time: fill.tradeTime,
                    remainingQty: remaining,
                    brokeragePerUnit: closeBrokeragePerUnit,
                    taxesPerUnit: closeTaxesPerUnit,
                });
            }
        }

        for (const lot of queue) {
            rows.push({
                symbol: sorted[0].symbol,
                segment: sorted[0].segment,
                product: sorted[0].product,
                side: lot.side,
                quantity: lot.remainingQty,
                entryPrice: lot.price,
                exitPrice: null,
                entryTime: lot.time,
                exitTime: null,
                brokerage: lot.brokeragePerUnit * lot.remainingQty,
                taxes: lot.taxesPerUnit * lot.remainingQty,
                stopLoss: null,
                target: null,
                confidence: null,
                exchange: sorted[0].exchange,
                broker: sorted[0].broker,
            });
        }
    }

    return rows;
}
