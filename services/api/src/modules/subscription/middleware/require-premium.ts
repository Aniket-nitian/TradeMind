import { Response, NextFunction } from "express";
import type { AuthRequest } from "../../auth/guards/auth.guard.js";
import { authRepository } from "../../auth/repositories/auth.repository.js";
import { AppError } from "../../../shared/exceptions/AppError.js";
import { SubscriptionPlan } from "../../../generated/prisma/enums.js";

export async function requirePremium(
    req: AuthRequest,
    _res: Response,
    next: NextFunction
) {
    try {
        const user = await authRepository.findUserById(req.userId!);

        if (!user || user.subscription !== SubscriptionPlan.PREMIUM) {
            throw new AppError(
                "This feature requires a Premium subscription.",
                403
            );
        }

        next();
    } catch (error) {
        next(error);
    }
}
