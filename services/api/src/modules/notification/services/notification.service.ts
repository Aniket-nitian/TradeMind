import { AppError } from "../../../shared/exceptions/AppError.js";
import { sendMail } from "../../../shared/utils/mailer.js";
import { notificationRepository } from "../repositories/notification.repository.js";
import { NotificationType } from "../../../generated/prisma/enums.js";

export class NotificationService {
    async listNotifications(userId: string, page = 1, limit = 20) {
        return notificationRepository.findAll(userId, page, limit);
    }

    async markAsRead(userId: string, id: string) {
        const notification = await notificationRepository.findById(
            id,
            userId
        );

        if (!notification) {
            throw new AppError("Notification not found.", 404);
        }

        return notificationRepository.markAsRead(id);
    }

    async markAllAsRead(userId: string) {
        await notificationRepository.markAllAsRead(userId);
    }

    async deleteNotification(userId: string, id: string) {
        const notification = await notificationRepository.findById(
            id,
            userId
        );

        if (!notification) {
            throw new AppError("Notification not found.", 404);
        }

        await notificationRepository.softDelete(id);
    }

    async notifyUser(
        user: { id: string; email: string; emailNotificationsEnabled: boolean },
        data: {
            type: NotificationType;
            title: string;
            message: string;
        },
        options: { email?: boolean } = {}
    ) {
        const notification = await notificationRepository.create(
            user.id,
            data
        );

        if (options.email && user.emailNotificationsEnabled) {
            await sendMail({
                to: user.email,
                subject: data.title,
                html: `<p>${data.message}</p>`,
            });
        }

        return notification;
    }
}

export const notificationService = new NotificationService();
