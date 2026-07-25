import { Response } from "express";
import { asyncHandler } from "../../../shared/middlewares/async-handler.js";
import { ApiResponse } from "../../../shared/response/api-response.js";
import { AppError } from "../../../shared/exceptions/AppError.js";
import { cloudinaryService } from "../../trade/services/cloudinary.service.js";
import type { AuthRequest } from "../../auth/guards/auth.guard.js";
import { userService } from "../services/user.service.js";
import {
  deactivateAccountSchema,
  notificationPreferencesSchema,
  updateProfileSchema,
} from "../validations/user.validation.js";

export const getProfile = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const user = await userService.getProfile(req.userId!);

    return new ApiResponse(
      true,
      "Profile fetched successfully",
      user
    ).send(res);
  }
);

export const updateProfile = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const data = updateProfileSchema.parse(req.body);

    const user = await userService.updateProfile(
      req.userId!,
      data
    );

    return new ApiResponse(
      true,
      "Profile updated successfully",
      user
    ).send(res);
  }
);

export const uploadAvatar = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    if (!req.file) {
      throw new AppError("Avatar image is required.", 400);
    }

    const uploaded = await cloudinaryService.uploadImage(
      req.file,
      "trademind/avatars"
    );

    const user = await userService.updateProfile(req.userId!, {
      avatarUrl: uploaded.url,
    });

    return new ApiResponse(
      true,
      "Avatar updated successfully",
      user
    ).send(res);
  }
);

export const updateNotificationPreferences = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const data = notificationPreferencesSchema.parse(req.body);

    const result = await userService.updateNotificationPreferences(
      req.userId!,
      data
    );

    return new ApiResponse(
      true,
      "Notification preferences updated successfully",
      result
    ).send(res);
  }
);

export const deactivateAccount = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const data = deactivateAccountSchema.parse(req.body);

    await userService.deactivateAccount(req.userId!, data);

    return new ApiResponse(
      true,
      "Account deactivated successfully",
      null
    ).send(res);
  }
);