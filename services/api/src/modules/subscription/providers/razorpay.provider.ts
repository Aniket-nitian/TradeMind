import Razorpay from "razorpay";
import { createHmac, timingSafeEqual } from "crypto";
import { env } from "../../../config/env.js";
import { AppError } from "../../../shared/exceptions/AppError.js";

const razorpay = new Razorpay({
    key_id: env.RAZORPAY_KEY_ID,
    key_secret: env.RAZORPAY_KEY_SECRET,
});

interface RazorpaySdkError {
    statusCode?: number;
    error?: { code?: string; description?: string };
}

function isRazorpaySdkError(error: unknown): error is RazorpaySdkError {
    return (
        typeof error === "object" &&
        error !== null &&
        ("statusCode" in error || "error" in error)
    );
}

function wrapRazorpayError(error: unknown, action: string): never {
    if (isRazorpaySdkError(error)) {
        const status = error.statusCode;
        const description = error.error?.description ?? error.error?.code;

        if (status === 401 || status === 403) {
            throw new AppError(
                `Razorpay rejected our API credentials while trying to ${action}` +
                    (description ? ` (${description})` : "") +
                    ". This usually means the configured Razorpay Test Mode key needs to be reactivated from the Razorpay dashboard.",
                502
            );
        }

        throw new AppError(
            `Razorpay ${action} failed` + (description ? `: ${description}` : "."),
            502
        );
    }

    throw error;
}

const PREMIUM_PLAN = {
    name: "TradeMind AI Premium",
    amount: 49900, // paise => ₹499.00
    currency: "INR",
    period: "monthly" as const,
    interval: 1,
};

const BILLING_CYCLES = 12;

let cachedPlanId: string | null = null;

async function ensurePlan(): Promise<string> {
    if (cachedPlanId) {
        return cachedPlanId;
    }

    try {
        const existing = await razorpay.plans.all({ count: 100 });

        const found = existing.items.find(
            plan => plan.item.name === PREMIUM_PLAN.name
        );

        if (found) {
            cachedPlanId = found.id;
            return found.id;
        }

        const created = await razorpay.plans.create({
            item: {
                name: PREMIUM_PLAN.name,
                amount: PREMIUM_PLAN.amount,
                currency: PREMIUM_PLAN.currency,
            },
            period: PREMIUM_PLAN.period,
            interval: PREMIUM_PLAN.interval,
        });

        cachedPlanId = created.id;
        return created.id;
    } catch (error) {
        wrapRazorpayError(error, "look up the Premium plan");
    }
}

export async function createSubscription(
    customerEmail: string,
    customerName: string
) {
    const planId = await ensurePlan();

    try {
        const subscription = await razorpay.subscriptions.create({
            plan_id: planId,
            total_count: BILLING_CYCLES,
            customer_notify: 1,
            notes: {
                email: customerEmail,
                name: customerName,
            },
        });

        return {
            subscriptionId: subscription.id,
            keyId: env.RAZORPAY_KEY_ID,
            shortUrl: subscription.short_url,
            status: subscription.status,
        };
    } catch (error) {
        wrapRazorpayError(error, "create the subscription");
    }
}

export async function cancelSubscription(subscriptionId: string) {
    try {
        return await razorpay.subscriptions.cancel(subscriptionId);
    } catch (error) {
        wrapRazorpayError(error, "cancel the subscription");
    }
}

export async function getSubscription(subscriptionId: string) {
    try {
        return await razorpay.subscriptions.fetch(subscriptionId);
    } catch (error) {
        wrapRazorpayError(error, "fetch the subscription");
    }
}

export async function getPayment(paymentId: string) {
    try {
        return await razorpay.payments.fetch(paymentId);
    } catch (error) {
        wrapRazorpayError(error, "fetch the payment");
    }
}

export function verifyWebhookSignature(
    rawBody: Buffer,
    signature: string
): boolean {
    const expected = createHmac("sha256", env.RAZORPAY_WEBHOOK_SECRET)
        .update(rawBody)
        .digest("hex");

    const expectedBuffer = Buffer.from(expected, "utf8");
    const signatureBuffer = Buffer.from(signature, "utf8");

    if (expectedBuffer.length !== signatureBuffer.length) {
        return false;
    }

    return timingSafeEqual(expectedBuffer, signatureBuffer);
}

export function assertValidWebhookSignature(
    rawBody: Buffer,
    signature: string | undefined
) {
    if (!signature || !verifyWebhookSignature(rawBody, signature)) {
        throw new AppError("Invalid webhook signature.", 400);
    }
}

export function verifyPaymentSignature(
    paymentId: string,
    subscriptionId: string,
    signature: string
): boolean {
    const expected = createHmac("sha256", env.RAZORPAY_KEY_SECRET)
        .update(`${paymentId}|${subscriptionId}`)
        .digest("hex");

    const expectedBuffer = Buffer.from(expected, "utf8");
    const signatureBuffer = Buffer.from(signature, "utf8");

    if (expectedBuffer.length !== signatureBuffer.length) {
        return false;
    }

    return timingSafeEqual(expectedBuffer, signatureBuffer);
}

export function assertValidPaymentSignature(
    paymentId: string,
    subscriptionId: string,
    signature: string | undefined
) {
    if (
        !signature ||
        !verifyPaymentSignature(paymentId, subscriptionId, signature)
    ) {
        throw new AppError("Invalid payment signature.", 400);
    }
}
