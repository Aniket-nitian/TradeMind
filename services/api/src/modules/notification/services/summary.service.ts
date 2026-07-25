import { prisma } from "../../../shared/database/prisma.js";
import { NotificationType } from "../../../generated/prisma/enums.js";
import { notificationService } from "./notification.service.js";

type SummaryUser = {
    id: string;
    email: string;
    emailNotificationsEnabled: boolean;
};

async function getTradeStatsForRange(
    userId: string,
    from: Date,
    to: Date
) {
    const trades = await prisma.trade.findMany({
        where: {
            userId,
            status: "CLOSED",
            deletedAt: null,
            exitTime: {
                gte: from,
                lt: to,
            },
        },
        select: {
            symbol: true,
            netPnl: true,
        },
    });

    const totalTrades = trades.length;
    const winningTrades = trades.filter(t => (t.netPnl ?? 0) > 0).length;
    const netPnL = trades.reduce((sum, t) => sum + (t.netPnl ?? 0), 0);

    const winRate =
        totalTrades === 0 ? 0 : (winningTrades / totalTrades) * 100;

    const bestTrade = trades.reduce(
        (best, t) =>
            !best || (t.netPnl ?? 0) > (best.netPnl ?? 0) ? t : best,
        trades[0] ?? null
    );

    const worstTrade = trades.reduce(
        (worst, t) =>
            !worst || (t.netPnl ?? 0) < (worst.netPnl ?? 0) ? t : worst,
        trades[0] ?? null
    );

    return {
        totalTrades,
        winningTrades,
        winRate: Number(winRate.toFixed(2)),
        netPnL: Number(netPnL.toFixed(2)),
        bestTrade,
        worstTrade,
    };
}

function formatSummaryMessage(
    stats: Awaited<ReturnType<typeof getTradeStatsForRange>>,
    label: string
) {
    if (stats.totalTrades === 0) {
        return `No closed trades ${label}.`;
    }

    const parts = [
        `${stats.totalTrades} trade${stats.totalTrades === 1 ? "" : "s"} closed ${label}`,
        `win rate ${stats.winRate}%`,
        `net P&L ${stats.netPnL >= 0 ? "+" : ""}${stats.netPnL}`,
    ];

    if (stats.bestTrade) {
        parts.push(
            `best: ${stats.bestTrade.symbol} (${stats.bestTrade.netPnl})`
        );
    }

    if (stats.worstTrade) {
        parts.push(
            `worst: ${stats.worstTrade.symbol} (${stats.worstTrade.netPnl})`
        );
    }

    return parts.join(", ") + ".";
}

export async function generateDailySummary(user: SummaryUser) {
    const to = new Date();
    to.setHours(0, 0, 0, 0);

    const from = new Date(to);
    from.setDate(from.getDate() - 1);

    const stats = await getTradeStatsForRange(user.id, from, to);

    return notificationService.notifyUser(
        user,
        {
            type: NotificationType.INFO,
            title: "Your Daily Trading Summary",
            message: formatSummaryMessage(stats, "yesterday"),
        },
        { email: true }
    );
}

export async function generateWeeklySummary(user: SummaryUser) {
    const to = new Date();
    to.setHours(0, 0, 0, 0);

    const from = new Date(to);
    from.setDate(from.getDate() - 7);

    const stats = await getTradeStatsForRange(user.id, from, to);

    return notificationService.notifyUser(
        user,
        {
            type: NotificationType.INFO,
            title: "Your Weekly Trading Summary",
            message: formatSummaryMessage(stats, "in the past 7 days"),
        },
        { email: true }
    );
}
