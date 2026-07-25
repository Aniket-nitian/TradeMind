import { Router } from "express";
import { PortfolioController } from "../controllers/portfolio.controller.js";
import { authGuard } from "../../auth/guards/auth.guard.js";

const router = Router();
const controller = new PortfolioController();

router.use(authGuard);

router.post("/capital", controller.recordCapital);
router.get("/capital", controller.getCapitalHistory);
router.delete("/capital/:id", controller.deleteCapitalTransaction);

router.get("/value", controller.getValue);
router.get("/holdings", controller.getHoldings);

router.post("/snapshot", controller.createSnapshot);
router.get("/snapshots", controller.getSnapshotHistory);

router.get("/analytics", controller.getAnalytics);

export default router;
