import { prisma } from "../../../shared/database/prisma.js";

export class SettingsRepository {
  async listActiveSessions(userId: string) {
    return prisma.session.findMany({
      where: {
        userId,
        isActive: true,
        deletedAt: null,
      },
      select: {
        id: true,
        deviceName: true,
        deviceType: true,
        browser: true,
        ipAddress: true,
        userAgent: true,
        lastActiveAt: true,
        createdAt: true,
      },
      orderBy: {
        lastActiveAt: "desc",
      },
    });
  }

  async findSessionById(id: string, userId: string) {
    return prisma.session.findFirst({
      where: {
        id,
        userId,
        isActive: true,
        deletedAt: null,
      },
    });
  }

  async revokeSession(id: string) {
    await prisma.refreshToken.deleteMany({
      where: { sessionId: id },
    });

    return prisma.session.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async countActiveSessions(userId: string) {
    return prisma.session.count({
      where: {
        userId,
        isActive: true,
        deletedAt: null,
      },
    });
  }
}

export const settingsRepository = new SettingsRepository();
