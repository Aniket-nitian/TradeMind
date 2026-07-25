import { AppError } from "../../../shared/exceptions/AppError.js";
import { marketService } from "../../market/services/market.service.js";
import { portfolioRepository } from "../repositories/portfolio.repository.js";
import type { RecordCapitalTransactionInput } from "../validations/portfolio.validation.js";

export class PortfolioService {
    async recordCapitalTransaction(
        userId: string,
        data: RecordCapitalTransactionInput
    ) {
        return portfolioRepository.createCapitalTransaction(userId, {
            type: data.type,
            amount: data.amount,
            note: data.note,
            transactionDate: data.transactionDate
                ? new Date(data.transactionDate)
                : new Date(),
        });
    }

    async getCapitalHistory(userId: string, page = 1, limit = 20) {
        return portfolioRepository.findCapitalTransactions(
            userId,
            page,
            limit
        );
    }

    async deleteCapitalTransaction(userId: string, id: string) {
        const transaction =
            await portfolioRepository.findCapitalTransactionById(
                id,
                userId
            );

        if (!transaction) {
            throw new AppError("Capital transaction not found.", 404);
        }

        await portfolioRepository.softDeleteCapitalTransaction(id);
    }

    async getHoldings(userId: string) {
        const openTrades = await portfolioRepository.getOpenTrades(
            userId
        );

        const holdingsMap = new Map<
            string,
            {
                symbol: string;
                segment: string;
                product: string;
                side: string;
                exchange: string | null;
                quantity: number;
                investedValue: number;
                strategyName: string | null;
            }
        >();

        for (const trade of openTrades) {
            const existing = holdingsMap.get(trade.symbol);
            const value = trade.entryPrice * trade.quantity;

            if (existing) {
                existing.quantity += trade.quantity;
                existing.investedValue += value;
            } else {
                holdingsMap.set(trade.symbol, {
                    symbol: trade.symbol,
                    segment: trade.segment,
                    product: trade.product,
                    side: trade.side,
                    exchange: trade.exchange ?? null,
                    quantity: trade.quantity,
                    investedValue: value,
                    strategyName: trade.strategy?.name ?? null,
                });
            }
        }

        const holdings = Array.from(holdingsMap.values());

        const equityHoldings = holdings.filter(h => h.segment === "EQUITY");

        const quotes = await marketService.getQuotes(
            equityHoldings.map(h => ({
                symbol: h.symbol,
                exchange: h.exchange,
            }))
        );

        return holdings.map(holding => {
            const avgEntryPrice = holding.investedValue / holding.quantity;
            const quote = quotes.get(holding.symbol);

            let currentPrice: number | null = null;
            let currentValue: number | null = null;
            let unrealizedPnl: number | null = null;
            let unrealizedPnlPercent: number | null = null;

            if (quote) {
                currentPrice = quote.price;
                currentValue = quote.price * holding.quantity;

                unrealizedPnl =
                    holding.side === "SELL"
                        ? holding.investedValue - currentValue
                        : currentValue - holding.investedValue;

                unrealizedPnlPercent =
                    holding.investedValue !== 0
                        ? (unrealizedPnl / holding.investedValue) * 100
                        : 0;
            }

            return {
                symbol: holding.symbol,
                segment: holding.segment,
                product: holding.product,
                side: holding.side,
                quantity: holding.quantity,
                avgEntryPrice: Number(avgEntryPrice.toFixed(2)),
                investedValue: Number(holding.investedValue.toFixed(2)),
                strategyName: holding.strategyName,
                currentPrice: currentPrice !== null ? Number(currentPrice.toFixed(2)) : null,
                currentValue: currentValue !== null ? Number(currentValue.toFixed(2)) : null,
                unrealizedPnl: unrealizedPnl !== null ? Number(unrealizedPnl.toFixed(2)) : null,
                unrealizedPnlPercent:
                    unrealizedPnlPercent !== null ? Number(unrealizedPnlPercent.toFixed(2)) : null,
            };
        });
    }

    private computeValue(
        netCapital: number,
        holdings: { investedValue: number; unrealizedPnl: number | null }[],
        realizedPnl: number
    ) {
        const invested = holdings.reduce(
            (sum, holding) => sum + holding.investedValue,
            0
        );

        const unrealizedPnl = holdings.reduce(
            (sum, holding) => sum + (holding.unrealizedPnl ?? 0),
            0
        );

        const cash = netCapital - invested + realizedPnl;
        const totalValue = netCapital + realizedPnl + unrealizedPnl;

        return {
            netCapital: Number(netCapital.toFixed(2)),
            invested: Number(invested.toFixed(2)),
            realizedPnl: Number(realizedPnl.toFixed(2)),
            unrealizedPnl: Number(unrealizedPnl.toFixed(2)),
            cash: Number(cash.toFixed(2)),
            totalValue: Number(totalValue.toFixed(2)),
        };
    }

    async getPortfolioValue(userId: string) {
        const [netCapital, holdings, realizedPnl] = await Promise.all([
            portfolioRepository.getNetCapital(userId),
            this.getHoldings(userId),
            portfolioRepository.getRealizedPnl(userId),
        ]);

        return this.computeValue(netCapital, holdings, realizedPnl);
    }

    async createSnapshot(userId: string) {
        const value = await this.getPortfolioValue(userId);

        return portfolioRepository.createSnapshot(userId, {
            totalValue: value.totalValue,
            invested: value.invested,
            unrealizedPnl: value.unrealizedPnl,
            realizedPnl: value.realizedPnl,
            cash: value.cash,
        });
    }

    async getSnapshotHistory(userId: string, page = 1, limit = 20) {
        return portfolioRepository.findSnapshots(userId, page, limit);
    }

    async getAnalytics(userId: string) {
        const [holdings, netCapital, realizedPnl] = await Promise.all([
            this.getHoldings(userId),
            portfolioRepository.getNetCapital(userId),
            portfolioRepository.getRealizedPnl(userId),
        ]);

        const value = this.computeValue(netCapital, holdings, realizedPnl);

        const bySymbol = holdings.map(h => ({
            symbol: h.symbol,
            investedValue: h.investedValue,
        }));

        const bySegment = new Map<string, number>();
        const byStrategy = new Map<string, number>();

        for (const h of holdings) {
            bySegment.set(
                h.segment,
                (bySegment.get(h.segment) ?? 0) + h.investedValue
            );

            const strategyKey = h.strategyName ?? "Unassigned";

            byStrategy.set(
                strategyKey,
                (byStrategy.get(strategyKey) ?? 0) + h.investedValue
            );
        }

        const capitalUtilization =
            value.netCapital === 0
                ? 0
                : (value.invested / value.netCapital) * 100;

        const returnPct =
            value.netCapital === 0
                ? 0
                : (value.realizedPnl / value.netCapital) * 100;

        return {
            allocation: {
                bySymbol,
                bySegment: Array.from(bySegment.entries()).map(
                    ([segment, investedValue]) => ({
                        segment,
                        investedValue,
                    })
                ),
                byStrategy: Array.from(byStrategy.entries()).map(
                    ([strategy, investedValue]) => ({
                        strategy,
                        investedValue,
                    })
                ),
            },
            capitalUtilization: Number(capitalUtilization.toFixed(2)),
            returnPct: Number(returnPct.toFixed(2)),
        };
    }
}

export const portfolioService = new PortfolioService();
