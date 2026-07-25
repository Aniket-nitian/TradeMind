import { Response } from "express";

import { asyncHandler } from "../../../shared/middlewares/async-handler.js";
import { ApiResponse } from "../../../shared/response/api-response.js";
import type { AuthRequest } from "../../auth/guards/auth.guard.js";
import { marketService } from "../services/market.service.js";

export const getIndices = asyncHandler(
  async (_req: AuthRequest, res: Response) => {
    const indices = await marketService.getIndices();

    return new ApiResponse(
      true,
      indices.length > 0
        ? "Indices fetched successfully"
        : "Live index data is temporarily unavailable",
      indices
    ).send(res);
  }
);
