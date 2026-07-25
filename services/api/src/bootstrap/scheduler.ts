import cron from "node-cron";
import { notificationRepository } from "../modules/notification/repositories/notification.repository.js";
import {
    generateDailySummary,
    generateWeeklySummary,
} from "../modules/notification/services/summary.service.js";
import { BrokerRepository } from "../modules/broker/repositories/broker.repository.js";
import { BrokerService } from "../modules/broker/services/broker.service.js";
import { authRepository } from "../modules/auth/repositories/auth.repository.js";
import { SubscriptionPlan } from "../generated/prisma/enums.js";
import { logger } from "../shared/logger/logger.js";
import { portfolioService } from "../modules/portfolio/services/portfolio.service.js";

const brokerRepository = new BrokerRepository();
const brokerService = new BrokerService();

async function runBrokerAutoSync() {
    const accounts = await brokerRepository.listAllConnectedAccounts();

    for (const account of accounts) {
        try {
            const user = await authRepository.findUserById(account.userId);

            if (user?.subscription !== SubscriptionPlan.PREMIUM) {
                continue;
            }

            await brokerService.syncTrades(account.userId, account.broker);
        } catch (error) {
            logger.error(
                { err: error, userId: account.userId, broker: account.broker },
                "Failed to auto-sync broker account"
            );
        }
    }
}

async function runPortfolioSnapshots() {
    const users = await notificationRepository.getActiveUsers();

    for (const user of users) {
        try {
            await portfolioService.createSnapshot(user.id);
        } catch (error) {
            logger.error(
                { err: error, userId: user.id },
                "Failed to create portfolio snapshot for user"
            );
        }
    }
}

async function runForAllUsers(
    label: string,
    generate: (user: {
        id: string;
        email: string;
        emailNotificationsEnabled: boolean;
    }) => Promise<unknown>
) {
    const users = await notificationRepository.getActiveUsers();

    for (const user of users) {
        try {
            await generate(user);
        } catch (error) {
            logger.error(
                { err: error, userId: user.id },
                `Failed to generate ${label} for user`
            );
        }
    }
}

export function startScheduler() {
    cron.schedule("0 7 * * *", () => {
        void runForAllUsers("daily summary", generateDailySummary);
    });

    cron.schedule("0 8 * * 1", () => {
        void runForAllUsers("weekly summary", generateWeeklySummary);
    });

    cron.schedule("0 */6 * * *", () => {
        void runBrokerAutoSync();
    });

    cron.schedule("0 18 * * *", () => {
        void runPortfolioSnapshots();
    });

    logger.info(
        "Notification scheduler started (daily + weekly summaries, 6-hourly broker auto-sync, daily portfolio snapshots)."
    );
}
