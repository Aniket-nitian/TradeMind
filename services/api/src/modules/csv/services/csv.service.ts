import { CsvRepository } from "../repositories/csv.repository.js";
import { validateTrades } from "../validations/csv.validation.js";
import { detectBroker, resolveAdapter } from "../adapters/index.js";
import { AppError } from "../../../shared/exceptions/AppError.js";
import {
    filterOutDuplicates,
    importTradeRows,
    type ImportRow,
} from "../../../shared/services/trade-import-runner.js";
import { Broker, CsvImportStatus } from "../../../generated/prisma/enums.js";

function toBrokerEnum(broker?: string): Broker | undefined {
    if (!broker) {
        return undefined;
    }

    const upper = broker.toUpperCase();

    return (Object.values(Broker) as string[]).includes(upper)
        ? (upper as Broker)
        : undefined;
}

export class CsvService {
    private csvRepository = new CsvRepository();

    async previewCsv(
        buffer: Buffer,
        userId: string,
        fileName: string,
        broker?: string
    ) {
        const effectiveBroker = broker ?? detectBroker(buffer);

        const adapter = resolveAdapter(effectiveBroker);

        const rows = await adapter.parse(buffer);

        const validationResult = validateTrades(rows);

        const { readyRows, duplicateCount } = await filterOutDuplicates(
            userId,
            validationResult.validRows as ImportRow[]
        );

        const importBatch = await this.csvRepository.createImportBatch(
            userId,
            {
                fileName,
                broker: toBrokerEnum(effectiveBroker),
                totalRows: rows.length,
                validRows: validationResult.validRows.length,
                invalidRows: validationResult.invalidRows.length,
                duplicateRows: duplicateCount,
                rows: readyRows,
                errors: validationResult.invalidRows,
            }
        );

        return {
            importId: importBatch.id,
            detectedBroker:
                !broker && effectiveBroker ? effectiveBroker : null,
            totalRows: rows.length,
            validRows: validationResult.validRows.length,
            invalidRows: validationResult.invalidRows.length,
            duplicateRows: duplicateCount,
            readyToImport: readyRows.length,
            preview: readyRows.slice(0, 20),
            errors: validationResult.invalidRows,
        };
    }

    async confirmImport(importId: string, userId: string) {
        const importBatch = await this.csvRepository.findImportById(
            importId,
            userId
        );

        if (!importBatch) {
            throw new AppError("Import batch not found.", 404);
        }

        if (importBatch.status !== CsvImportStatus.PENDING) {
            throw new AppError(
                "This import has already been processed.",
                400
            );
        }

        const storedRows = importBatch.rows as unknown as ImportRow[];

        const { imported, duplicateCount, skippedInvalid } =
            await importTradeRows(userId, storedRows);

        const status =
            imported.length === 0
                ? CsvImportStatus.FAILED
                : imported.length === storedRows.length
                    ? CsvImportStatus.COMPLETED
                    : CsvImportStatus.PARTIAL;

        await this.csvRepository.markImportStatus(importId, {
            status,
            importedRows: imported.length,
        });

        return {
            importId,
            status,
            importedRows: imported.length,
            skippedDuplicates: duplicateCount,
            skippedInvalid: skippedInvalid.length,
            trades: imported,
        };
    }

    async getImportHistory(userId: string, page = 1, limit = 20) {
        return this.csvRepository.findImportHistory(userId, page, limit);
    }

    async getImportById(importId: string, userId: string) {
        const importBatch = await this.csvRepository.findImportById(
            importId,
            userId
        );

        if (!importBatch) {
            throw new AppError("Import batch not found.", 404);
        }

        return importBatch;
    }
}
