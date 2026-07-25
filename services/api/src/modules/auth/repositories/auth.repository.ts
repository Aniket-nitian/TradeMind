import { prisma } from "../../../shared/database/prisma.js";
import type { RegisterInput } from "../validations/auth.validation.js";

export class AuthRepository {
  async findUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async findUserById(id: string) {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  async createUser(data: RegisterInput, passwordHash: string) {
    return prisma.user.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        passwordHash,
      },
    });
  }

  async loginUser(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async findUserByGoogleId(googleId: string) {
    return prisma.user.findUnique({
      where: { googleId },
    });
  }

  async createGoogleUser(data: {
    googleId: string;
    email: string;
    firstName: string;
    lastName?: string;
  }) {
    return prisma.user.create({
      data: {
        googleId: data.googleId,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        passwordHash: null,
        isEmailVerified: true,
      },
    });
  }

  async linkGoogleAccount(userId: string, googleId: string) {
    return prisma.user.update({
      where: { id: userId },
      data: { googleId },
    });
  }

  async verifyEmail(userId: string) {
    return prisma.user.update({
      where: { id: userId },
      data: {
        isEmailVerified: true,
      },
    });
  }

  async createEmailVerificationToken(
    userId: string,
    token: string,
    expiresAt: Date
  ) {
    return prisma.emailVerification.create({
      data: {
        userId,
        token,
        expiresAt,
      },
    });
  }

  async findEmailVerificationToken(token: string) {
    return prisma.emailVerification.findUnique({
      where: {
        token,
      },
      include: {
        user: true,
      },
    });
  }

  async deleteEmailVerificationToken(token: string) {
    return prisma.emailVerification.delete({
      where: {
        token,
      },
    });
  }

  async createPasswordResetToken(
    userId: string,
    token: string,
    expiresAt: Date
  ) {
    return prisma.passwordReset.create({
      data: {
        userId,
        token,
        expiresAt,
      },
    });
  }

  async findPasswordResetToken(token: string) {
    return prisma.passwordReset.findUnique({
      where: {
        token,
      },
      include: {
        user: true,
      },
    });
  }

  async deletePasswordResetToken(token: string) {
    return prisma.passwordReset.delete({
      where: {
        token,
      },
    });
  }

  async updatePassword(userId: string, passwordHash: string) {
    return prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        passwordHash,
      },
    });
  }

  async saveRefreshToken(
    userId: string,
    token: string,
    expiresAt: Date,
    sessionId?: string
  ) {
    return prisma.refreshToken.create({
      data: {
        userId,
        token,
        expiresAt,
        sessionId,
      },
    });
  }

  async findRefreshToken(token: string) {
    return prisma.refreshToken.findUnique({
      where: {
        token,
      },
      include: {
        user: true,
      },
    });
  }

  async deleteRefreshToken(token: string) {
    return prisma.refreshToken.delete({
      where: {
        token,
      },
    });
  }

  async deleteAllRefreshTokens(userId: string) {
    return prisma.refreshToken.deleteMany({
      where: {
        userId,
      },
    });
  }

  async createSession(
    userId: string,
    meta: { ipAddress?: string; userAgent?: string }
  ) {
    return prisma.session.create({
      data: {
        userId,
        ipAddress: meta.ipAddress,
        userAgent: meta.userAgent,
      },
    });
  }

  async touchSession(sessionId: string) {
    return prisma.session.update({
      where: { id: sessionId },
      data: { lastActiveAt: new Date() },
    });
  }

  async deactivateSession(sessionId: string) {
    return prisma.session.update({
      where: { id: sessionId },
      data: { isActive: false },
    });
  }

  async deactivateAllSessions(userId: string) {
    return prisma.session.updateMany({
      where: { userId },
      data: { isActive: false },
    });
  }
}

export const authRepository = new AuthRepository();