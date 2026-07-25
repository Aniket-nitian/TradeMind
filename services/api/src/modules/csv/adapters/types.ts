import type { NormalizedTradeRow } from "../../../shared/types/trade-import.js";

export type { NormalizedTradeRow as NormalizedImportRow } from "../../../shared/types/trade-import.js";

export interface BrokerAdapter {
    parse(buffer: Buffer): Promise<NormalizedTradeRow[]>;
}
