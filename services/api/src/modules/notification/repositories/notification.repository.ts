import { prisma } from "../../../shared/database/prisma.js";
import { NotificationType } from "../../../generated/prisma/enums.js";

export class NotificationRepository {
    async create(
        userId: string,
        data: {
            type: NotificationType;
            title: string;
            message: string;
        }
    ) {
        return prisma.notification.create({
            data: {
                userId,
                ...data,
            },
        });
    }

    async findAll(userId: string, page = 1, limit = 20) {
        const skip = (page - 1) * limit;

        const [notifications, total, unreadCount] =
            await prisma.$transaction([
                prisma.notification.findMany({
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

                prisma.notification.count({
                    where: {
                        userId,
                        deletedAt: null,
                    },
                }),

                prisma.notification.count({
                    where: {
                        userId,
                        deletedAt: null,
                        isRead: false,
                    },
                }),
            ]);

        return {
            notifications,
            unreadCount,
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

    async findById(id: string, userId: string) {
        return prisma.notification.findFirst({
            where: {
                id,
                userId,
                deletedAt: null,
            },
        });
    }

    async markAsRead(id: string) {
        return prisma.notification.update({
            where: {
                id,
            },
            data: {
                isRead: true,
            },
        });
    }

    async markAllAsRead(userId: string) {
        return prisma.notification.updateMany({
            where: {
                userId,
                deletedAt: null,
                isRead: false,
            },
            data: {
                isRead: true,
            },
        });
    }

    async softDelete(id: string) {
        return prisma.notification.update({
            where: {
                id,
            },
            data: {
                deletedAt: new Date(),
            },
        });
    }

    async getActiveUsers() {
        return prisma.user.findMany({
            where: {
                deletedAt: null,
            },
            select: {
                id: true,
                email: true,
                emailNotificationsEnabled: true,
            },
        });
    }
}

export const notificationRepository = new NotificationRepository();
