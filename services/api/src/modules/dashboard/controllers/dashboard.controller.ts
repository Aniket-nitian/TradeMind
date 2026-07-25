import { Request, Response } from "express";
import { dashboardService } from "../services/dashboard.service.js";
import { asyncHandler } from "../../../shared/middlewares/async-handler.js";
import { ApiResponse } from "../../../shared/response/api-response.js";


class DashboardController {

  getOverview = asyncHandler(async (req: Request, res: Response) => {

    const overview = await dashboardService.getOverview(
      req.userId
    );

    return new ApiResponse(
      true,
      "Dashboard overview fetched successfully.",
      overview
    ).send(res);

  });

  getEquityCurve = asyncHandler(
  async (req: Request, res: Response) => {

    const curve =
      await dashboardService.getEquityCurve(
        req.userId
      );

    return new ApiResponse(
      true,
      "Equity curve fetched successfully.",
      curve
    ).send(res);

  }
);

getMonthlyPerformance = asyncHandler(
  async (req: Request, res: Response) => {
    const data =
      await dashboardService.getMonthlyPerformance(
        req.userId
      );

    return new ApiResponse(
      true,
      "Monthly performance fetched successfully.",
      data
    ).send(res);
  }
);

getWinLossDistribution = asyncHandler(
  async (req: Request, res: Response) => {

    const data =
      await dashboardService.getWinLossDistribution(
        req.userId
      );

    return new ApiResponse(
      true,
      "Win/Loss distribution fetched successfully.",
      data
    ).send(res);

  }
);
getStrategyAnalytics = asyncHandler(
  async (req: Request, res: Response) => {

    const data =
      await dashboardService.getStrategyAnalytics(
        req.userId
      );

    return new ApiResponse(
      true,
      "Strategy analytics fetched successfully.",
      data
    ).send(res);

  }
);

getBrokerAnalytics = asyncHandler(
  async (req: Request, res: Response) => {

    const data =
      await dashboardService.getBrokerAnalytics(
        req.userId
      );

    return new ApiResponse(
      true,
      "Broker analytics fetched successfully.",
      data
    ).send(res);

  }
);

getMistakeAnalytics = asyncHandler(
  async (req: Request, res: Response) => {

    const data =
      await dashboardService.getMistakeAnalytics(
        req.userId
      );

    return new ApiResponse(
      true,
      "Mistake analytics fetched successfully.",
      data
    ).send(res);

  }
);

getPsychologyAnalytics = asyncHandler(
  async (req: Request, res: Response) => {

    const data =
      await dashboardService.getPsychologyAnalytics(
        req.userId
      );

    return new ApiResponse(
      true,
      "Psychology analytics fetched successfully.",
      data
    ).send(res);

  }
);

getCalendarHeatmap = asyncHandler(
    async (req, res) => {

        const data =
            await dashboardService.getCalendarHeatmap(
                req.userId
            );

        return new ApiResponse(
            true,
            "Calendar heatmap fetched successfully.",
            data
        ).send(res);

    }
);

getDrawdownAnalytics = asyncHandler(
  async (req: Request, res: Response) => {

    const data =
      await dashboardService.getDrawdownAnalytics(
        req.userId
      );

    return new ApiResponse(
      true,
      "Drawdown analytics fetched successfully.",
      data
    ).send(res);

  }
);

getHoldingTimeAnalytics = asyncHandler(
  async (req, res) => {
    const data =
      await dashboardService.getHoldingTimeAnalytics(
        req.userId
      );

    return new ApiResponse(
      true,
      "Holding time analytics fetched successfully.",
      data
    ).send(res);
  }
);

getDayOfWeekAnalytics = asyncHandler(
  async (req, res) => {
    const data =
      await dashboardService.getDayOfWeekAnalytics(
        req.userId
      );

    return new ApiResponse(
      true,
      "Day of week analytics fetched successfully.",
      data
    ).send(res);
  }
);

getTimeOfDayAnalytics = asyncHandler(
  async (req, res) => {
    const data =
      await dashboardService.getTimeOfDayAnalytics(
        req.userId
      );

    return new ApiResponse(
      true,
      "Time of day analytics fetched successfully.",
      data
    ).send(res);
  }
);

getConfidenceAnalytics = asyncHandler(
    async (req, res) => {

        const data =
            await dashboardService.getConfidenceAnalytics(
                req.userId
            );

        return new ApiResponse(
            true,
            "Confidence analytics fetched successfully.",
            data
        ).send(res);

    }
);

getTradeStreakAnalytics = asyncHandler(
  async (req, res) => {

    const data =
      await dashboardService.getTradeStreakAnalytics(
        req.userId
      );

    return new ApiResponse(
      true,
      "Trade streak analytics fetched successfully.",
      data
    ).send(res);

  }
);
}

export const dashboardController =
  new DashboardController();