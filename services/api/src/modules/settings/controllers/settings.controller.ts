import { Request, Response, NextFunction } from "express";
import { settingsService } from "../services/settings.service.js";
import { ApiResponse } from "../../../shared/response/api-response.js";
import {
  brokerPreferencesSchema,
  tradingPreferencesSchema,
} from "../validations/settings.validation.js";

export class SettingsController {
  getSettings = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const result = await settingsService.getSettings(req.userId!);

      new ApiResponse(
        true,
        "Settings fetched successfully.",
        result
      ).send(res);
    } catch (error) {
      next(error);
    }
  };

  updateTradingPreferences = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const data = tradingPreferencesSchema.parse(req.body);

      const result = await settingsService.updateTradingPreferences(
        req.userId!,
        data
      );

      new ApiResponse(
        true,
        "Trading preferences updated successfully.",
        result
      ).send(res);
    } catch (error) {
      next(error);
    }
  };

  updateBrokerPreferences = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const data = brokerPreferencesSchema.parse(req.body);

      const result = await settingsService.updateBrokerPreferences(
        req.userId!,
        data
      );

      new ApiResponse(
        true,
        "Broker preferences updated successfully.",
        result
      ).send(res);
    } catch (error) {
      next(error);
    }
  };

  listSessions = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const result = await settingsService.listSessions(req.userId!);

      new ApiResponse(
        true,
        "Active sessions fetched successfully.",
        result
      ).send(res);
    } catch (error) {
      next(error);
    }
  };

  revokeSession = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const result = await settingsService.revokeSession(
        req.params.id as string,
        req.userId!
      );

      new ApiResponse(
        true,
        "Session revoked successfully.",
        result
      ).send(res);
    } catch (error) {
      next(error);
    }
  };
}
