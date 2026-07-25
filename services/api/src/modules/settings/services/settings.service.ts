import { AppError } from "../../../shared/exceptions/AppError.js";
import { userRepository } from "../../user/repositories/user.repository.js";
import { settingsRepository } from "../repositories/settings.repository.js";
import type {
  BrokerPreferencesInput,
  TradingPreferencesInput,
} from "../validations/settings.validation.js";

export class SettingsService {
  async getSettings(userId: string) {
    const profile = await userRepository.getProfile(userId);

    if (!profile) {
      throw new AppError("User not found.", 404);
    }

    const activeSessionCount =
      await settingsRepository.countActiveSessions(userId);

    return { profile, activeSessionCount };
  }

  async updateTradingPreferences(
    userId: string,
    data: TradingPreferencesInput
  ) {
    return userRepository.updateProfile(userId, data);
  }

  async updateBrokerPreferences(
    userId: string,
    data: BrokerPreferencesInput
  ) {
    return userRepository.updateProfile(userId, data);
  }

  async listSessions(userId: string) {
    return settingsRepository.listActiveSessions(userId);
  }

  async revokeSession(sessionId: string, userId: string) {
    const session = await settingsRepository.findSessionById(
      sessionId,
      userId
    );

    if (!session) {
      throw new AppError("Session not found.", 404);
    }

    await settingsRepository.revokeSession(sessionId);

    return { revoked: true };
  }
}

export const settingsService = new SettingsService();
