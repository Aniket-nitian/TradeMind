import { Router } from "express";
import {
  deactivateAccount,
  getProfile,
  updateNotificationPreferences,
  updateProfile,
  uploadAvatar,
} from "../controllers/user.controller.js";
import { authGuard } from "../../auth/guards/auth.guard.js";
import { upload } from "../../../shared/upload/multer.js";

const router = Router();

router.get("/profile", authGuard, getProfile);

router.put("/profile", authGuard, updateProfile);

router.post(
  "/avatar",
  authGuard,
  upload.single("avatar"),
  uploadAvatar
);

router.patch(
  "/notifications",
  authGuard,
  updateNotificationPreferences
);

router.post("/deactivate", authGuard, deactivateAccount);

export default router;