import bcrypt from "bcrypt";
import { OAuth2Client } from "google-auth-library";
import { authRepository } from "../repositories/auth.repository.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../tokens/jwt.js";
import { AppError } from "../../../shared/exceptions/AppError.js";
import { generateToken } from "../../../shared/utils/token.js";
import { sendMail } from "../../../shared/utils/mailer.js";
import { logAudit } from "../../../shared/services/audit-log.service.js";
import { logger } from "../../../shared/logger/logger.js";
import { env } from "../../../config/env.js";
import type {
  ChangePasswordInput,
  LoginInput,
  RegisterInput,
} from "../validations/auth.validation.js";

const googleClient = new OAuth2Client(env.GOOGLE_CLIENT_ID);

const EMAIL_VERIFICATION_TTL_MS = 24 * 60 * 60 * 1000;
const PASSWORD_RESET_TTL_MS = 60 * 60 * 1000;

export class AuthService {
  async register(data: RegisterInput) {
    const existingUser = await authRepository.findUserByEmail(data.email);

    if (existingUser) {
      throw new AppError("Email already registered.", 409);
    }

    const passwordHash = await bcrypt.hash(data.password, 12);

    const user = await authRepository.createUser(data, passwordHash);

    await this.sendVerificationEmail(user.id, user.email);

    await logAudit({
      userId: user.id,
      action: "user.register",
      entity: "User",
      entityId: user.id,
    });

    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      createdAt: user.createdAt,
    };
  }

  private async sendVerificationEmail(userId: string, email: string) {
    const token = generateToken();

    await authRepository.createEmailVerificationToken(
      userId,
      token,
      new Date(Date.now() + EMAIL_VERIFICATION_TTL_MS)
    );

    const link = `${env.CLIENT_URL}/verify-email?token=${token}`;

    sendMail({
      to: email,
      subject: "Verify your TradeMind AI email",
      html: `<p>Welcome to TradeMind AI.</p><p>Click the link below to verify your email:</p><p><a href="${link}">${link}</a></p><p>This link expires in 24 hours.</p>`,
    }).catch((err) => logger.error({ err }, "Failed to send verification email"));
  }

  async resendVerification(userId: string) {
    const user = await authRepository.findUserById(userId);

    if (!user) {
      throw new AppError("User not found.", 404);
    }

    if (user.isEmailVerified) {
      throw new AppError("Email is already verified.", 400);
    }

    await this.sendVerificationEmail(user.id, user.email);
  }

  async verifyEmail(token: string) {
    const record = await authRepository.findEmailVerificationToken(token);

    if (!record || record.expiresAt < new Date()) {
      throw new AppError("Invalid or expired verification token.", 400);
    }

    await authRepository.verifyEmail(record.userId);
    await authRepository.deleteEmailVerificationToken(token);
  }

  async requestPasswordReset(email: string) {
    const user = await authRepository.findUserByEmail(email);

    if (user) {
      const token = generateToken();

      await authRepository.createPasswordResetToken(
        user.id,
        token,
        new Date(Date.now() + PASSWORD_RESET_TTL_MS)
      );

      const link = `${env.CLIENT_URL}/reset-password?token=${token}`;

      sendMail({
        to: user.email,
        subject: "Reset your TradeMind AI password",
        html: `<p>We received a request to reset your password.</p><p><a href="${link}">${link}</a></p><p>This link expires in 1 hour. If you didn't request this, you can ignore this email.</p>`,
      }).catch((err) => logger.error({ err }, "Failed to send password reset email"));
    }

    return {
      message:
        "If an account exists for that email, a reset link has been sent.",
    };
  }

  async resetPassword(token: string, newPassword: string) {
    const record = await authRepository.findPasswordResetToken(token);

    if (!record || record.expiresAt < new Date()) {
      throw new AppError("Invalid or expired reset token.", 400);
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);

    await authRepository.updatePassword(record.userId, passwordHash);
    await authRepository.deletePasswordResetToken(token);
    await authRepository.deleteAllRefreshTokens(record.userId);

    await logAudit({
      userId: record.userId,
      action: "user.reset_password",
      entity: "User",
      entityId: record.userId,
    });
  }

  async changePassword(userId: string, data: ChangePasswordInput) {
    const user = await authRepository.findUserById(userId);

    if (!user) {
      throw new AppError("User not found.", 404);
    }

    if (!user.passwordHash) {
      throw new AppError(
        "This account uses Google Sign-In and has no password to change.",
        400
      );
    }

    const matched = await bcrypt.compare(
      data.currentPassword,
      user.passwordHash
    );

    if (!matched) {
      throw new AppError("Current password is incorrect.", 401);
    }

    const passwordHash = await bcrypt.hash(data.newPassword, 12);

    await authRepository.updatePassword(userId, passwordHash);
    await authRepository.deleteAllRefreshTokens(userId);

    await logAudit({
      userId,
      action: "user.change_password",
      entity: "User",
      entityId: userId,
    });
  }

  async login(
    data: LoginInput,
    meta: { ipAddress?: string; userAgent?: string } = {}
  ) {
    const user = await authRepository.loginUser(data.email);

    if (!user) {
      throw new AppError("Invalid credentials", 401);
    }

    if (user.deletedAt) {
      throw new AppError("Account is deactivated.", 401);
    }

    if (!user.passwordHash) {
      throw new AppError(
        "This account uses Google Sign-In. Use the Google button instead.",
        401
      );
    }

    const matched = await bcrypt.compare(
      data.password,
      user.passwordHash
    );

    if (!matched) {
      throw new AppError("Invalid credentials", 401);
    }

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    const session = await authRepository.createSession(user.id, meta);

    await authRepository.saveRefreshToken(
      user.id,
      refreshToken,
      expiresAt,
      session.id
    );

    await logAudit({
      userId: user.id,
      action: "user.login",
      entity: "User",
      entityId: user.id,
    });

    return {
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
      accessToken,
      refreshToken,
    };
  }

  async loginWithGoogle(
    idToken: string,
    meta: { ipAddress?: string; userAgent?: string } = {}
  ) {
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload?.sub || !payload.email) {
      throw new AppError("Invalid Google token.", 401);
    }

    const googleId = payload.sub;
    const email = payload.email.toLowerCase();

    let user = await authRepository.findUserByGoogleId(googleId);

    if (!user) {
      const existingByEmail = await authRepository.findUserByEmail(email);

      if (existingByEmail) {
        user = await authRepository.linkGoogleAccount(
            existingByEmail.id,
            googleId
        );
      } else {
        user = await authRepository.createGoogleUser({
          googleId,
          email,
          firstName: payload.given_name ?? "",
          lastName: payload.family_name,
        });
      }
    }

    if (user.deletedAt) {
      throw new AppError("Account is deactivated.", 401);
    }

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    const session = await authRepository.createSession(user.id, meta);

    await authRepository.saveRefreshToken(
      user.id,
      refreshToken,
      expiresAt,
      session.id
    );

    await logAudit({
      userId: user.id,
      action: "user.google_login",
      entity: "User",
      entityId: user.id,
    });

    return {
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
      accessToken,
      refreshToken,
    };
  }

  async refresh(token: string) {
    if (!token) {
      throw new AppError("Refresh token missing", 401);
    }

    verifyRefreshToken(token);

    const storedToken =
      await authRepository.findRefreshToken(token);

    if (!storedToken) {
      throw new AppError("Invalid refresh token", 401);
    }

    await authRepository.deleteRefreshToken(token);

    const accessToken = generateAccessToken(
      storedToken.user.id
    );

    const newRefreshToken = generateRefreshToken(
      storedToken.user.id
    );

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    if (storedToken.sessionId) {
      await authRepository.touchSession(storedToken.sessionId);
    }

    await authRepository.saveRefreshToken(
      storedToken.user.id,
      newRefreshToken,
      expiresAt,
      storedToken.sessionId ?? undefined
    );

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }

  async logout(token: string) {
    if (!token) return;

    const storedToken = await authRepository.findRefreshToken(token);

    await authRepository.deleteRefreshToken(token);

    if (storedToken?.sessionId) {
      await authRepository.deactivateSession(storedToken.sessionId);
    }
  }

  async logoutAll(userId: string) {
    await authRepository.deleteAllRefreshTokens(userId);
    await authRepository.deactivateAllSessions(userId);
  }
}

export const authService = new AuthService();