import { Router } from "express";
import { SettingsController } from "../controllers/settings.controller.js";
import { authGuard } from "../../auth/guards/auth.guard.js";

const router = Router();
const controller = new SettingsController();

router.use(authGuard);

router.get("/", controller.getSettings);
router.patch("/trading-preferences", controller.updateTradingPreferences);
router.patch("/broker-preferences", controller.updateBrokerPreferences);
router.get("/sessions", controller.listSessions);
router.delete("/sessions/:id", controller.revokeSession);

export default router;
