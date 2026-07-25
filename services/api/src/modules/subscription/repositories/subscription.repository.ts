import { prisma } from "../../../shared/database/prisma.js";
import {
    PaymentStatus,
    SubscriptionPlan,
    SubscriptionStatus,
} from "../../../generated/prisma/enums.js";

export class SubscriptionRepository {
    async findByUserId(userId: string) {
        return prisma.subscription.findFirst({
            where: {
                userId,
                deletedAt: null,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }

    async findByProviderSubscriptionId(providerSubscriptionId: string) {
        return prisma.subscription.findFirst({
            where: {
                providerSubscriptionId,
                deletedAt: null,
            },
        });
    }

    async createSubscription(
        userId: string,
        data: {
            providerSubscriptionId: string;
            plan: SubscriptionPlan;
            status: SubscriptionStatus;
            currentPeriodStart?: Date;
            currentPeriodEnd?: Date;
        }
    ) {
        return prisma.subscription.create({
            data: {
                userId,
                ...data,
            },
        });
    }

    async updateSubscription(
        id: string,
        data: {
            plan?: SubscriptionPlan;
            status?: SubscriptionStatus;
            currentPeriodStart?: Date;
            currentPeriodEnd?: Date;
        }
    ) {
        return prisma.subscription.update({
            where: {
                id,
            },
            data,
        });
    }

    async updateUserPlan(userId: string, plan: SubscriptionPlan) {
        return prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                subscription: plan,
            },
        });
    }

    async createPayment(data: {
        userId: string;
        subscriptionId?: string;
        providerPaymentId?: string;
        providerOrderId?: string;
        amount: number;
        currency: string;
        status: PaymentStatus;
    }) {
        return prisma.payment.create({
            data,
        });
    }

    async findPaymentHistory(userId: string, page = 1, limit = 20) {
        const skip = (page - 1) * limit;

        const [payments, total] = await prisma.$transaction([
            prisma.payment.findMany({
                where: {
                    userId,
                    deletedAt: null,
                },
                skip,
                take: limit,
                orderBy: {
                    createdAt: "desc",
                },
            }),

            prisma.payment.count({
                where: {
                    userId,
                    deletedAt: null,
                },
            }),
        ]);

        return {
            payments,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
                hasNext: page * limit < total,
                hasPrevious: page > 1,
            },
        };
    }
}

export const subscriptionRepository = new SubscriptionRepository();
