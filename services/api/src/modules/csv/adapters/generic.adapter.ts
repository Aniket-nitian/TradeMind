import { parseCsv } from "../utils/csvParser.js";
import type { BrokerAdapter, NormalizedImportRow } from "./types.js";

export const genericAdapter: BrokerAdapter = {
    async parse(buffer: Buffer): Promise<NormalizedImportRow[]> {
        return parseCsv(buffer);
    },
};
