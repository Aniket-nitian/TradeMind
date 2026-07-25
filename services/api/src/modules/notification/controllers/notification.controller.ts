import { Request, Response, NextFunction } from "express";
import { notificationService } from "../services/notification.service.js";
import { ApiResponse } from "../../../shared/response/api-response.js";
import { paginationQuerySchema } from "../validations/notification.validation.js";

export class NotificationController {
    list = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { page, limit } = paginationQuerySchema.parse(
                req.query
            );

            const result = await notificationService.listNotifications(
                req.userId!,
                page,
                limit
            );

            new ApiResponse(
                true,
                "Notifications fetched successfully.",
                result
            ).send(res);
        } catch (error) {
            next(error);
        }
    };

    markAsRead = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const result = await notificationService.markAsRead(
                req.userId!,
                (req.params.id as string)
            );

            new ApiResponse(
                true,
                "Notification marked as read.",
                result
            ).send(res);
        } catch (error) {
            next(error);
        }
    };

    markAllAsRead = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            await notificationService.markAllAsRead(req.userId!);

            new ApiResponse(
                true,
                "All notifications marked as read.",
                null
            ).send(res);
        } catch (error) {
            next(error);
        }
    };

    delete = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            await notificationService.deleteNotification(
                req.userId!,
                (req.params.id as string)
            );

            new ApiResponse(
                true,
                "Notification deleted successfully.",
                null
            ).send(res);
        } catch (error) {
            next(error);
        }
    };
}
