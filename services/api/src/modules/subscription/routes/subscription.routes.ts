import { Router } from "express";
import { SubscriptionController } from "../controllers/subscription.controller.js";
import { authGuard } from "../../auth/guards/auth.guard.js";

const router = Router();
const controller = new SubscriptionController();

router.post("/webhook", controller.webhook);

router.use(authGuard);

router.post("/subscribe", controller.subscribe);
router.get("/", controller.getStatus);
router.post("/verify", controller.verify);
router.post("/sync", controller.syncStatus);
router.post("/cancel", controller.cancel);
router.get("/payments", controller.getPaymentHistory);

export default router;
