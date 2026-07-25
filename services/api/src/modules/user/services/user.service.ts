import bcrypt from "bcrypt";
import { AppError } from "../../../shared/exceptions/AppError.js";
import { authRepository } from "../../auth/repositories/auth.repository.js";
import { userRepository } from "../repositories/user.repository.js";
import { logAudit } from "../../../shared/services/audit-log.service.js";
import type {
  DeactivateAccountInput,
  NotificationPreferencesInput,
  UpdateProfileInput,
} from "../validations/user.validation.js";

export class UserService {
  async getProfile(userId: string) {
    const user = await userRepository.getProfile(userId);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return user;
  }

  async updateProfile(
    userId: string,
    data: UpdateProfileInput
  ) {
    if (data.username) {
      const existing = await userRepository.usernameExists(
        data.username
      );

      if (existing && existing.id !== userId) {
        throw new AppError("Username already exists", 409);
      }
    }

    return userRepository.updateProfile(userId, data);
  }

  async updateNotificationPreferences(
    userId: string,
    data: NotificationPreferencesInput
  ) {
    return userRepository.updateNotificationPreferences(userId, data);
  }

  async deactivateAccount(
    userId: string,
    data: DeactivateAccountInput
  ) {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    if (!user.passwordHash) {
      throw new AppError(
        "This account uses Google Sign-In and has no password to confirm.",
        400
      );
    }

    const matched = await bcrypt.compare(
      data.password,
      user.passwordHash
    );

    if (!matched) {
      throw new AppError("Incorrect password.", 401);
    }

    await userRepository.deactivate(userId);
    await authRepository.deleteAllRefreshTokens(userId);

    await logAudit({
      userId,
      action: "user.deactivate",
      entity: "User",
      entityId: userId,
    });
  }
}

export const userService = new UserService();