import { Router } from "express";
import { dashboardController } from "../controllers/dashboard.controller.js";
import { authGuard } from "../../auth/guards/auth.guard.js";


const router = Router();

router.use(authGuard);

router.get(
  "/overview",
  dashboardController.getOverview
);

router.get(
  "/equity-curve",
  dashboardController.getEquityCurve
);

router.get(
  "/monthly-performance",
  dashboardController.getMonthlyPerformance
);

router.get(
  "/win-loss",
  dashboardController.getWinLossDistribution
);

router.get(
  "/strategies",
  dashboardController.getStrategyAnalytics
);

router.get(
  "/brokers",
  dashboardController.getBrokerAnalytics
);

router.get(
  "/mistakes",
  dashboardController.getMistakeAnalytics
);

router.get(
  "/psychology",
  dashboardController.getPsychologyAnalytics
);

router.get(
    "/calendar",
    dashboardController.getCalendarHeatmap
);

router.get(
  "/drawdown",
  dashboardController.getDrawdownAnalytics
);

router.get(
  "/holding-time",
  dashboardController.getHoldingTimeAnalytics
);

router.get(
  "/day-of-week",
  dashboardController.getDayOfWeekAnalytics
);

router.get(
  "/time-of-day",
  dashboardController.getTimeOfDayAnalytics
);

router.get(
    "/confidence",
    dashboardController.getConfidenceAnalytics
);

router.get(
  "/streaks",
  dashboardController.getTradeStreakAnalytics
);

export default router;