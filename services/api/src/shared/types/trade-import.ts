export interface NormalizedTradeRow {
    symbol: string;
    segment: string;
    product: string;
    side: string;
    quantity: number | string;
    entryPrice: number | string;
    exitPrice?: number | string | null;
    stopLoss?: number | string | null;
    target?: number | string | null;
    entryTime: string;
    exitTime?: string | null;
    brokerage?: number | string;
    taxes?: number | string;
    confidence?: number | string | null;
    exchange?: string;
    broker?: string;
    tradeNotes?: string;
}
