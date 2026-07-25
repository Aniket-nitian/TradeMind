import type { Prisma } from "../../../generated/prisma/client.js";
import { prisma } from "../../../shared/database/prisma.js";
import type {
  NotificationPreferencesInput,
  UpdateProfileInput,
} from "../validations/user.validation.js";

export class UserRepository {
  async getProfile(userId: string) {
    return prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        username: true,
        email: true,
        avatarUrl: true,
        bio: true,
        tradingExperience: true,
        riskProfile: true,
        preferredBroker: true,
        tradingStyle: true,
        timezone: true,
        currency: true,
        subscription: true,
        defaultAccountSize: true,
        defaultRiskPercent: true,
        brokerSyncLookbackDays: true,
        isEmailVerified: true,
        emailNotificationsEnabled: true,
        whatsappNotificationsEnabled: true,
        createdAt: true,
      },
    });
  }

  async updateProfile(
    userId: string,
    data: UpdateProfileInput
  ) {
    return prisma.user.update({
      where: {
        id: userId,
      },
      data: data satisfies Prisma.UserUncheckedUpdateInput,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        username: true,
        email: true,
        avatarUrl: true,
        bio: true,
        tradingExperience: true,
        riskProfile: true,
        preferredBroker: true,
        tradingStyle: true,
        timezone: true,
        currency: true,
        subscription: true,
        defaultAccountSize: true,
        defaultRiskPercent: true,
        brokerSyncLookbackDays: true,
        isEmailVerified: true,
        emailNotificationsEnabled: true,
        whatsappNotificationsEnabled: true,
        createdAt: true,
      },
    });
  }

  async usernameExists(username: string) {
    return prisma.user.findUnique({
      where: {
        username,
      },
    });
  }

  async findById(userId: string) {
    return prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
  }

  async updateNotificationPreferences(
    userId: string,
    data: NotificationPreferencesInput
  ) {
    return prisma.user.update({
      where: {
        id: userId,
      },
      data,
      select: {
        id: true,
        emailNotificationsEnabled: true,
        whatsappNotificationsEnabled: true,
      },
    });
  }

  async deactivate(userId: string) {
    return prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}

export const userRepository = new UserRepository();