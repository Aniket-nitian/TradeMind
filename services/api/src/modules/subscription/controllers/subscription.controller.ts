import { Request, Response, NextFunction } from "express";
import { subscriptionService } from "../services/subscription.service.js";
import { ApiResponse } from "../../../shared/response/api-response.js";
import {
    paginationQuerySchema,
    verifySubscriptionSchema,
} from "../validations/subscription.validation.js";
import { assertValidWebhookSignature } from "../providers/razorpay.provider.js";

export class SubscriptionController {
    subscribe = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const result = await subscriptionService.subscribe(
                req.userId!
            );

            new ApiResponse(
                true,
                "Subscription created — complete payment authorization to activate.",
                result
            ).send(res, 201);
        } catch (error) {
            next(error);
        }
    };

    getStatus = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const result = await subscriptionService.getStatus(
                req.userId!
            );

            new ApiResponse(
                true,
                "Subscription status fetched successfully.",
                result
            ).send(res);
        } catch (error) {
            next(error);
        }
    };

    syncStatus = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const result = await subscriptionService.syncStatus(
                req.userId!
            );

            new ApiResponse(
                true,
                "Subscription status synced successfully.",
                result
            ).send(res);
        } catch (error) {
            next(error);
        }
    };

    verify = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const data = verifySubscriptionSchema.parse(req.body);

            const result = await subscriptionService.verifyAndActivate(
                req.userId!,
                data
            );

            new ApiResponse(
                true,
                "Payment verified — Premium is now active.",
                result
            ).send(res);
        } catch (error) {
            next(error);
        }
    };

    cancel = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const result = await subscriptionService.cancel(req.userId!);

            new ApiResponse(
                true,
                "Subscription cancelled successfully.",
                result
            ).send(res);
        } catch (error) {
            next(error);
        }
    };

    getPaymentHistory = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { page, limit } = paginationQuerySchema.parse(
                req.query
            );

            const result = await subscriptionService.getPaymentHistory(
                req.userId!,
                page,
                limit
            );

            new ApiResponse(
                true,
                "Payment history fetched successfully.",
                result
            ).send(res);
        } catch (error) {
            next(error);
        }
    };

    webhook = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const signature = req.headers["x-razorpay-signature"] as
                | string
                | undefined;

            const rawBody = (req as Request & { rawBody?: Buffer })
                .rawBody;

            assertValidWebhookSignature(rawBody ?? Buffer.from(""), signature);

            const { event, payload } = req.body;

            await subscriptionService.handleWebhookEvent(event, payload);

            res.status(200).json({ success: true });
        } catch (error) {
            next(error);
        }
    };
}
