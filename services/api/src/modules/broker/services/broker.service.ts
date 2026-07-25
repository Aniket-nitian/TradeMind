import { BrokerRepository } from "../repositories/broker.repository.js";
import { resolveProvider } from "../providers/index.js";
import { matchFillsToTrades } from "../utils/position-matcher.js";
import { encrypt, decrypt } from "../../../shared/utils/crypto.js";
import { AppError } from "../../../shared/exceptions/AppError.js";
import { importTradeRows, type ImportRow } from "../../../shared/services/trade-import-runner.js";
import { logAudit } from "../../../shared/services/audit-log.service.js";
import { authRepository } from "../../auth/repositories/auth.repository.js";
import { Broker, CsvImportStatus } from "../../../generated/prisma/enums.js";

const DEFAULT_LOOKBACK_DAYS = 30;

export class BrokerService {
    private brokerRepository = new BrokerRepository();

    async connectAccount(
        userId: string,
        broker: Broker,
        credentials: Record<string, string>
    ) {
        const provider = resolveProvider(broker);

        const connection = await provider.connect(credentials);

        const account = await this.brokerRepository.upsertAccount(userId, {
            broker,
            brokerUserId: connection.brokerUserId,
            accessTokenEnc: encrypt(connection.accessToken),
            tokenExpiresAt: connection.expiresAt,
            refreshTokenEnc: connection.refreshPayload
                ? encrypt(connection.refreshPayload)
                : null,
        });

        await logAudit({
            userId,
            action: "broker.connect",
            entity: "BrokerAccount",
            entityId: account.id,
            metadata: { broker },
        });

        return {
            id: account.id,
            broker: account.broker,
            brokerUserId: account.brokerUserId,
            isConnected: account.isConnected,
            tokenExpiresAt: account.tokenExpiresAt,
        };
    }

    async disconnectAccount(userId: string, broker: Broker) {
        await this.brokerRepository.disconnectAccount(userId, broker);

        await logAudit({
            userId,
            action: "broker.disconnect",
            entity: "BrokerAccount",
            metadata: { broker },
        });

        return {
            broker,
            isConnected: false,
        };
    }

    async listAccounts(userId: string) {
        return this.brokerRepository.listAccounts(userId);
    }

    async syncTrades(userId: string, broker: Broker) {
        const account = await this.brokerRepository.findAccount(
            userId,
            broker
        );

        if (!account || !account.isConnected || !account.accessTokenEnc) {
            throw new AppError(
                `No connected ${broker} account found.`,
                404
            );
        }

        const provider = resolveProvider(broker);

        let accessToken = decrypt(account.accessTokenEnc);

        if (account.tokenExpiresAt && account.tokenExpiresAt < new Date()) {
            const renewed = provider.renewToken && account.refreshTokenEnc
                ? await provider
                    .renewToken({
                        accessToken,
                        refreshToken: decrypt(account.refreshTokenEnc),
                    })
                    .catch(() => null)
                : null;

            if (!renewed) {
                throw new AppError(
                    `Your ${broker} connection has expired — please reconnect.`,
                    400
                );
            }

            await this.brokerRepository.updateAccessToken(account.id, {
                accessTokenEnc: encrypt(renewed.accessToken),
                tokenExpiresAt: renewed.expiresAt,
            });

            accessToken = renewed.accessToken;
        }

        const user = await authRepository.findUserById(userId);
        const lookbackDays =
            user?.brokerSyncLookbackDays ?? DEFAULT_LOOKBACK_DAYS;

        const lookbackFloor = new Date(
            Date.now() - lookbackDays * 24 * 60 * 60 * 1000
        );
        const fromDate =
            account.lastSyncedAt && account.lastSyncedAt < lookbackFloor
                ? account.lastSyncedAt
                : lookbackFloor;
        const toDate = new Date();

        const fills = await provider.fetchTrades(
            { accessToken, brokerUserId: account.brokerUserId ?? "" },
            { fromDate, toDate }
        );

        const matchedRows = matchFillsToTrades(fills);

        const syncLog = await this.brokerRepository.createSyncLog({
            userId,
            brokerAccountId: account.id,
            broker,
            fromDate,
            toDate,
            totalFetched: fills.length,
            matchedTrades: matchedRows.length,
        });

        const { imported, duplicateCount, skippedInvalid } =
            await importTradeRows(
                userId,
                matchedRows as unknown as ImportRow[]
            );

        const status =
            matchedRows.length === 0
                ? CsvImportStatus.COMPLETED
                : imported.length === 0
                    ? CsvImportStatus.FAILED
                    : imported.length === matchedRows.length
                        ? CsvImportStatus.COMPLETED
                        : CsvImportStatus.PARTIAL;

        await this.brokerRepository.updateSyncLog(syncLog.id, {
            status,
            importedRows: imported.length,
            duplicateRows: duplicateCount,
            errors: skippedInvalid,
        });

        await this.brokerRepository.updateLastSyncedAt(account.id, toDate);

        return {
            syncLogId: syncLog.id,
            status,
            totalFetched: fills.length,
            matchedTrades: matchedRows.length,
            importedRows: imported.length,
            duplicateRows: duplicateCount,
            skippedInvalid: skippedInvalid.length,
            trades: imported,
        };
    }

    async getSyncHistory(userId: string, page = 1, limit = 20) {
        return this.brokerRepository.findSyncHistory(userId, page, limit);
    }

    async getSyncLogById(id: string, userId: string) {
        const log = await this.brokerRepository.findSyncLogById(id, userId);

        if (!log) {
            throw new AppError("Sync log not found.", 404);
        }

        return log;
    }
}
