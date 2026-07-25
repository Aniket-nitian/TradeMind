import { Router } from "express";
import { NotificationController } from "../controllers/notification.controller.js";
import { authGuard } from "../../auth/guards/auth.guard.js";

const router = Router();
const controller = new NotificationController();

router.use(authGuard);

router.get("/", controller.list);
router.patch("/read-all", controller.markAllAsRead);
router.patch("/:id/read", controller.markAsRead);
router.delete("/:id", controller.delete);

export default router;
