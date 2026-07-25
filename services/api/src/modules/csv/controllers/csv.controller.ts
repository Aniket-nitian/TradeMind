import { Request, Response, NextFunction } from "express";
import { CsvService } from "../services/csv.service.js";
import { ApiResponse } from "../../../shared/response/api-response.js";
import { importHistoryQuerySchema, uploadBrokerSchema } from "../validations/csv.validation.js";

export class CsvController {
    private csvService = new CsvService();

    upload = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            if (!req.file) {
                res.status(400).json({
                    success: false,
                    message: "CSV file is required",
                });
                return;
            }

            const { broker } = uploadBrokerSchema.parse(req.body);

            const result = await this.csvService.previewCsv(
                req.file.buffer,
                req.userId!,
                req.file.originalname,
                broker
            );

            res.status(200).json({
                success: true,
                message: "CSV parsed successfully",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };

    confirm = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const result = await this.csvService.confirmImport(
                (req.params.importId as string),
                req.userId!
            );

            new ApiResponse(
                true,
                "Import confirmed successfully.",
                result
            ).send(res);
        } catch (error) {
            next(error);
        }
    };

    history = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { page, limit } = importHistoryQuerySchema.parse(
                req.query
            );

            const result = await this.csvService.getImportHistory(
                req.userId!,
                page,
                limit
            );

            new ApiResponse(
                true,
                "Import history fetched successfully.",
                result
            ).send(res);
        } catch (error) {
            next(error);
        }
    };

    getImport = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const result = await this.csvService.getImportById(
                (req.params.importId as string),
                req.userId!
            );

            new ApiResponse(
                true,
                "Import fetched successfully.",
                result
            ).send(res);
        } catch (error) {
            next(error);
        }
    };
}
