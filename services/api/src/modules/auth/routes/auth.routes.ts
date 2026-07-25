import { Router } from "express";
import {
  changePassword,
  forgotPassword,
  googleLogin,
  login,
  logout,
  logoutAll,
  me,
  refresh,
  register,
  resendVerification,
  resetPassword,
  verifyEmail,
} from "../controllers/auth.controller.js";
import { authGuard } from "../guards/auth.guard.js";
import { authRateLimiter } from "../../../shared/middlewares/rate-limit.middleware.js";

const router = Router();

router.post("/register", authRateLimiter, register);
router.post("/login", authRateLimiter, login);
router.post("/google", authRateLimiter, googleLogin);
router.post("/refresh", refresh);
router.post("/logout", logout);

router.post("/verify-email", authRateLimiter, verifyEmail);
router.post("/forgot-password", authRateLimiter, forgotPassword);
router.post("/reset-password", authRateLimiter, resetPassword);

router.post("/logout-all", authGuard, logoutAll);
router.post("/resend-verification", authGuard, authRateLimiter, resendVerification);
router.post("/change-password", authGuard, changePassword);

router.get("/me", authGuard, me);

export default router;