import { Request, Response, NextFunction } from "express";
import { portfolioService } from "../services/portfolio.service.js";
import { ApiResponse } from "../../../shared/response/api-response.js";
import {
    paginationQuerySchema,
    recordCapitalTransactionSchema,
} from "../validations/portfolio.validation.js";

export class PortfolioController {
    recordCapital = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const data = recordCapitalTransactionSchema.parse(req.body);

            const result = await portfolioService.recordCapitalTransaction(
                req.userId!,
                data
            );

            new ApiResponse(
                true,
                "Capital transaction recorded successfully.",
                result
            ).send(res, 201);
        } catch (error) {
            next(error);
        }
    };

    getCapitalHistory = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { page, limit } = paginationQuerySchema.parse(
                req.query
            );

            const result = await portfolioService.getCapitalHistory(
                req.userId!,
                page,
                limit
            );

            new ApiResponse(
                true,
                "Capital history fetched successfully.",
                result
            ).send(res);
        } catch (error) {
            next(error);
        }
    };

    deleteCapitalTransaction = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            await portfolioService.deleteCapitalTransaction(
                req.userId!,
                (req.params.id as string)
            );

            new ApiResponse(
                true,
                "Capital transaction deleted successfully.",
                null
            ).send(res);
        } catch (error) {
            next(error);
        }
    };

    getValue = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const result = await portfolioService.getPortfolioValue(
                req.userId!
            );

            new ApiResponse(
                true,
                "Portfolio value fetched successfully.",
                result
            ).send(res);
        } catch (error) {
            next(error);
        }
    };

    getHoldings = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const result = await portfolioService.getHoldings(
                req.userId!
            );

            new ApiResponse(
                true,
                "Holdings fetched successfully.",
                result
            ).send(res);
        } catch (error) {
            next(error);
        }
    };

    createSnapshot = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const result = await portfolioService.createSnapshot(
                req.userId!
            );

            new ApiResponse(
                true,
                "Portfolio snapshot created successfully.",
                result
            ).send(res, 201);
        } catch (error) {
            next(error);
        }
    };

    getSnapshotHistory = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { page, limit } = paginationQuerySchema.parse(
                req.query
            );

            const result = await portfolioService.getSnapshotHistory(
                req.userId!,
                page,
                limit
            );

            new ApiResponse(
                true,
                "Snapshot history fetched successfully.",
                result
            ).send(res);
        } catch (error) {
            next(error);
        }
    };

    getAnalytics = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const result = await portfolioService.getAnalytics(
                req.userId!
            );

            new ApiResponse(
                true,
                "Portfolio analytics fetched successfully.",
                result
            ).send(res);
        } catch (error) {
            next(error);
        }
    };
}
