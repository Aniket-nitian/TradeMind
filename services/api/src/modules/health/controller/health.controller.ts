import { Request, Response } from "express";
import { healthService } from "../services/health.service.js";
import { asyncHandler } from "../../../shared/middlewares/async-handler.js";
import { ApiResponse } from "../../../shared/response/api-response.js";


export const healthController = asyncHandler(async (_req: Request, res: Response) => {
  const result = await healthService.getHealthStatus();

  return new ApiResponse(
    result.healthy,
    result.message,
    {
      timestamp: result.timestamp,
      uptime: result.uptime,
      database: result.database,
    }
  ).send(res, result.healthy ? 200 : 503);
});