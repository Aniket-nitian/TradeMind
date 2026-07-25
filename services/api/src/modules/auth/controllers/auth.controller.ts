import { Request, Response } from "express";
import { asyncHandler } from "../../../shared/middlewares/async-handler.js";
import { ApiResponse } from "../../../shared/response/api-response.js";
import { authService } from "../services/auth.service.js";
import {
  changePasswordSchema,
  forgotPasswordSchema,
  googleLoginSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  verifyEmailSchema,
} from "../validations/auth.validation.js";
import type { AuthRequest } from "../guards/auth.guard.js";

const isProd = process.env.NODE_ENV === "production";

// The web app and API are on different subdomains in production (both under
// onrender.com, which is itself in the Public Suffix List — so they're
// cross-site, not just cross-origin). A Lax cookie is dropped on the
// cross-site XHR calls the frontend makes, so refresh silently fails on
// every reload. None is required to actually reach the API in that setup.
const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: isProd,
  sameSite: (isProd ? "none" : "lax") as "none" | "lax",
  maxAge: 30 * 24 * 60 * 60 * 1000,
};

export const register = asyncHandler(async (req: Request, res: Response) => {
  const data = registerSchema.parse(req.body);

  const user = await authService.register(data);

  return new ApiResponse(
    true,
    "Account created successfully.",
    user
  ).send(res, 201);
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const data = loginSchema.parse(req.body);

  const result = await authService.login(data, {
    ipAddress: req.ip,
    userAgent: req.headers["user-agent"],
  });

  res.cookie("refreshToken", result.refreshToken, REFRESH_COOKIE_OPTIONS);

  return new ApiResponse(
    true,
    "Login successful",
    {
      user: result.user,
      accessToken: result.accessToken,
    }
  ).send(res);
});

export const googleLogin = asyncHandler(async (req: Request, res: Response) => {
  const data = googleLoginSchema.parse(req.body);

  const result = await authService.loginWithGoogle(data.idToken, {
    ipAddress: req.ip,
    userAgent: req.headers["user-agent"],
  });

  res.cookie("refreshToken", result.refreshToken, REFRESH_COOKIE_OPTIONS);

  return new ApiResponse(
    true,
    "Login successful",
    {
      user: result.user,
      accessToken: result.accessToken,
    }
  ).send(res);
});

export const refresh = asyncHandler(async (_req: Request, res: Response) => {
  const token = _req.cookies.refreshToken;

  const result = await authService.refresh(token);

  res.cookie("refreshToken", result.refreshToken, REFRESH_COOKIE_OPTIONS);

  return new ApiResponse(
    true,
    "Token refreshed successfully",
    {
      accessToken: result.accessToken,
    }
  ).send(res);
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;

  await authService.logout(token);

  res.clearCookie("refreshToken", {
    httpOnly: REFRESH_COOKIE_OPTIONS.httpOnly,
    secure: REFRESH_COOKIE_OPTIONS.secure,
    sameSite: REFRESH_COOKIE_OPTIONS.sameSite,
  });

  return new ApiResponse(
    true,
    "Logged out successfully",
    null
  ).send(res);
});

export const logoutAll = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    await authService.logoutAll(req.userId!);

    res.clearCookie("refreshToken", {
      httpOnly: REFRESH_COOKIE_OPTIONS.httpOnly,
      secure: REFRESH_COOKIE_OPTIONS.secure,
      sameSite: REFRESH_COOKIE_OPTIONS.sameSite,
    });

    return new ApiResponse(
      true,
      "Logged out from all devices",
      null
    ).send(res);
  }
);

export const verifyEmail = asyncHandler(
  async (req: Request, res: Response) => {
    const data = verifyEmailSchema.parse(req.body);

    await authService.verifyEmail(data.token);

    return new ApiResponse(
      true,
      "Email verified successfully.",
      null
    ).send(res);
  }
);

export const resendVerification = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    await authService.resendVerification(req.userId!);

    return new ApiResponse(
      true,
      "Verification email sent.",
      null
    ).send(res);
  }
);

export const forgotPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const data = forgotPasswordSchema.parse(req.body);

    const result = await authService.requestPasswordReset(data.email);

    return new ApiResponse(true, result.message, null).send(res);
  }
);

export const resetPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const data = resetPasswordSchema.parse(req.body);

    await authService.resetPassword(data.token, data.newPassword);

    return new ApiResponse(
      true,
      "Password reset successfully.",
      null
    ).send(res);
  }
);

export const changePassword = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const data = changePasswordSchema.parse(req.body);

    await authService.changePassword(req.userId!, data);

    return new ApiResponse(
      true,
      "Password changed successfully.",
      null
    ).send(res);
  }
);

export const me = asyncHandler(async (req: AuthRequest, res: Response) => {
  return new ApiResponse(
    true,
    "Current user",
    {
      userId: req.userId,
    }
  ).send(res);
});