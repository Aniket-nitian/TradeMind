import { Router } from "express";
import { BrokerController } from "../controllers/broker.controller.js";
import { authGuard } from "../../auth/guards/auth.guard.js";
import { requirePremium } from "../../subscription/middleware/require-premium.js";

const router = Router();
const controller = new BrokerController();

router.use(authGuard);

router.post("/connect", requirePremium, controller.connect);
router.get("/", controller.list);
router.delete("/:broker", controller.disconnect);
router.post("/:broker/sync", requirePremium, controller.sync);
router.get("/sync-history", controller.history);
router.get("/sync-history/:id", controller.getSyncLog);

export default router;
