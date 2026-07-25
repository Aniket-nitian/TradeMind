import { AppError } from "../../../shared/exceptions/AppError.js";
import { authRepository } from "../../auth/repositories/auth.repository.js";
import { subscriptionRepository } from "../repositories/subscription.repository.js";
import { logAudit } from "../../../shared/services/audit-log.service.js";
import { logger } from "../../../shared/logger/logger.js";
import * as razorpayProvider from "../providers/razorpay.provider.js";
import {
    PaymentStatus,
    SubscriptionPlan,
    SubscriptionStatus,
} from "../../../generated/prisma/enums.js";

interface RazorpaySubscriptionEntity {
    id: string;
    status: string;
    current_start?: number | null;
    current_end?: number | null;
    notes?: { email?: string; name?: string };
}

interface RazorpayPaymentEntity {
    id: string;
    amount: number;
    currency: string;
}

export class SubscriptionService {
    async subscribe(userId: string) {
        const user = await authRepository.findUserById(userId);

        if (!user) {
            throw new AppError("User not found.", 404);
        }

        const fullName = [user.firstName, user.lastName]
            .filter(Boolean)
            .join(" ");

        const result = await razorpayProvider.createSubscription(
            user.email,
            fullName
        );

        await logAudit({
            userId,
            action: "subscription.subscribe",
            entity: "Subscription",
            metadata: { providerSubscriptionId: result.subscriptionId },
        });

        return result;
    }

    async getStatus(userId: string) {
        const user = await authRepository.findUserById(userId);

        if (!user) {
            throw new AppError("User not found.", 404);
        }

        const subscription = await subscriptionRepository.findByUserId(
            userId
        );

        return {
            plan: user.subscription,
            subscription,
        };
    }

    async verifyAndActivate(
        userId: string,
        payload: { paymentId: string; subscriptionId: string; signature: string }
    ) {
        razorpayProvider.assertValidPaymentSignature(
            payload.paymentId,
            payload.subscriptionId,
            payload.signature
        );

        const [remoteSubscription, payment] = await Promise.all([
            razorpayProvider.getSubscription(payload.subscriptionId),
            razorpayProvider.getPayment(payload.paymentId),
        ]);

        const periodStart = remoteSubscription?.current_start
            ? new Date(remoteSubscription.current_start * 1000)
            : undefined;
        const periodEnd = remoteSubscription?.current_end
            ? new Date(remoteSubscription.current_end * 1000)
            : undefined;

        const existing =
            await subscriptionRepository.findByProviderSubscriptionId(
                payload.subscriptionId
            );

        let subscriptionRowId: string;

        if (existing) {
            await subscriptionRepository.updateSubscription(existing.id, {
                plan: SubscriptionPlan.PREMIUM,
                status: SubscriptionStatus.ACTIVE,
                currentPeriodStart: periodStart,
                currentPeriodEnd: periodEnd,
            });
            subscriptionRowId = existing.id;
        } else {
            const created = await subscriptionRepository.createSubscription(
                userId,
                {
                    providerSubscriptionId: payload.subscriptionId,
                    plan: SubscriptionPlan.PREMIUM,
                    status: SubscriptionStatus.ACTIVE,
                    currentPeriodStart: periodStart,
                    currentPeriodEnd: periodEnd,
                }
            );
            subscriptionRowId = created.id;
        }

        await subscriptionRepository.updateUserPlan(
            userId,
            SubscriptionPlan.PREMIUM
        );

        await subscriptionRepository.createPayment({
            userId,
            subscriptionId: subscriptionRowId,
            providerPaymentId: payload.paymentId,
            amount: payment ? Number(payment.amount) / 100 : 0,
            currency: payment?.currency ?? "INR",
            status: PaymentStatus.SUCCESS,
        });

        await logAudit({
            userId,
            action: "subscription.verify",
            entity: "Subscription",
            entityId: subscriptionRowId,
            metadata: { providerPaymentId: payload.paymentId },
        });

        return this.getStatus(userId);
    }

    async syncStatus(userId: string) {
        const subscription = await subscriptionRepository.findByUserId(userId);

        if (!subscription || !subscription.providerSubscriptionId) {
            throw new AppError("No subscription found.", 404);
        }

        const remote = await razorpayProvider.getSubscription(
            subscription.providerSubscriptionId
        );

        const statusMap: Partial<Record<string, SubscriptionStatus>> = {
            active: SubscriptionStatus.ACTIVE,
            authenticated: SubscriptionStatus.ACTIVE,
            completed: SubscriptionStatus.ACTIVE,
            pending: SubscriptionStatus.PAST_DUE,
            halted: SubscriptionStatus.PAST_DUE,
            cancelled: SubscriptionStatus.CANCELED,
            expired: SubscriptionStatus.CANCELED,
        };

        const mappedStatus = remote?.status ? statusMap[remote.status] : undefined;

        if (mappedStatus) {
            const plan =
                mappedStatus === SubscriptionStatus.ACTIVE
                    ? SubscriptionPlan.PREMIUM
                    : SubscriptionPlan.FREE;

            await subscriptionRepository.updateSubscription(subscription.id, {
                plan: mappedStatus === SubscriptionStatus.ACTIVE ? plan : undefined,
                status: mappedStatus,
                currentPeriodStart: remote?.current_start
                    ? new Date(remote.current_start * 1000)
                    : undefined,
                currentPeriodEnd: remote?.current_end
                    ? new Date(remote.current_end * 1000)
                    : undefined,
            });

            await subscriptionRepository.updateUserPlan(userId, plan);

            await logAudit({
                userId,
                action: "subscription.sync",
                entity: "Subscription",
                entityId: subscription.id,
                metadata: { remoteStatus: remote?.status },
            });
        }

        return this.getStatus(userId);
    }

    async cancel(userId: string) {
        const subscription = await subscriptionRepository.findByUserId(
            userId
        );

        if (
            !subscription ||
            subscription.status !== SubscriptionStatus.ACTIVE ||
            !subscription.providerSubscriptionId
        ) {
            throw new AppError("No active subscription found.", 404);
        }

        await razorpayProvider.cancelSubscription(
            subscription.providerSubscriptionId
        );

        await subscriptionRepository.updateSubscription(subscription.id, {
            status: SubscriptionStatus.CANCELED,
        });

        await subscriptionRepository.updateUserPlan(
            userId,
            SubscriptionPlan.FREE
        );

        await logAudit({
            userId,
            action: "subscription.cancel",
            entity: "Subscription",
            entityId: subscription.id,
        });

        return { status: "cancelled" };
    }

    async getPaymentHistory(userId: string, page = 1, limit = 20) {
        return subscriptionRepository.findPaymentHistory(
            userId,
            page,
            limit
        );
    }

    async handleWebhookEvent(
        event: string,
        payload: {
            subscription?: { entity: RazorpaySubscriptionEntity };
            payment?: { entity: RazorpayPaymentEntity };
        }
    ) {
        logger.info({ webhook: "razorpay", event }, "Received Razorpay webhook");

        if (event === "subscription.activated") {
            await this.onSubscriptionActivated(payload);
        } else if (event === "subscription.charged") {
            await this.onSubscriptionCharged(payload);
        } else if (event === "subscription.cancelled") {
            await this.onSubscriptionCancelled(payload);
        } else {
            logger.info(
                { webhook: "razorpay", event },
                "Unrecognized Razorpay webhook event, no action taken"
            );
        }
    }

    private async onSubscriptionActivated(payload: {
        subscription?: { entity: RazorpaySubscriptionEntity };
    }) {
        const sub = payload.subscription?.entity;
        const email = sub?.notes?.email;

        if (!sub || !email) {
            return;
        }

        const user = await authRepository.findUserByEmail(email);

        if (!user) {
            return;
        }

        const periodStart = sub.current_start
            ? new Date(sub.current_start * 1000)
            : undefined;
        const periodEnd = sub.current_end
            ? new Date(sub.current_end * 1000)
            : undefined;

        const existing =
            await subscriptionRepository.findByProviderSubscriptionId(
                sub.id
            );

        if (existing) {
            await subscriptionRepository.updateSubscription(existing.id, {
                plan: SubscriptionPlan.PREMIUM,
                status: SubscriptionStatus.ACTIVE,
                currentPeriodStart: periodStart,
                currentPeriodEnd: periodEnd,
            });
        } else {
            await subscriptionRepository.createSubscription(user.id, {
                providerSubscriptionId: sub.id,
                plan: SubscriptionPlan.PREMIUM,
                status: SubscriptionStatus.ACTIVE,
                currentPeriodStart: periodStart,
                currentPeriodEnd: periodEnd,
            });
        }

        await subscriptionRepository.updateUserPlan(
            user.id,
            SubscriptionPlan.PREMIUM
        );
    }

    private async onSubscriptionCharged(payload: {
        subscription?: { entity: RazorpaySubscriptionEntity };
        payment?: { entity: RazorpayPaymentEntity };
    }) {
        const sub = payload.subscription?.entity;

        if (!sub) {
            return;
        }

        const existing =
            await subscriptionRepository.findByProviderSubscriptionId(
                sub.id
            );

        if (!existing) {
            return;
        }

        await subscriptionRepository.updateSubscription(existing.id, {
            plan: SubscriptionPlan.PREMIUM,
            status: SubscriptionStatus.ACTIVE,
            currentPeriodStart: sub.current_start
                ? new Date(sub.current_start * 1000)
                : undefined,
            currentPeriodEnd: sub.current_end
                ? new Date(sub.current_end * 1000)
                : undefined,
        });

        const payment = payload.payment?.entity;

        await subscriptionRepository.createPayment({
            userId: existing.userId,
            subscriptionId: existing.id,
            providerPaymentId: payment?.id,
            amount: payment ? Number(payment.amount) / 100 : 0,
            currency: payment?.currency ?? "INR",
            status: PaymentStatus.SUCCESS,
        });
    }

    private async onSubscriptionCancelled(payload: {
        subscription?: { entity: RazorpaySubscriptionEntity };
    }) {
        const sub = payload.subscription?.entity;

        if (!sub) {
            return;
        }

        const existing =
            await subscriptionRepository.findByProviderSubscriptionId(
                sub.id
            );

        if (!existing) {
            return;
        }

        await subscriptionRepository.updateSubscription(existing.id, {
            status: SubscriptionStatus.CANCELED,
        });

        await subscriptionRepository.updateUserPlan(
            existing.userId,
            SubscriptionPlan.FREE
        );
    }
}

export const subscriptionService = new SubscriptionService();
