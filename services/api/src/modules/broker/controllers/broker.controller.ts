import { Request, Response, NextFunction } from "express";
import { BrokerService } from "../services/broker.service.js";
import { ApiResponse } from "../../../shared/response/api-response.js";
import {
    brokerParamSchema,
    connectBrokerSchema,
    syncHistoryQuerySchema,
} from "../validations/broker.validation.js";

export class BrokerController {
    private brokerService = new BrokerService();

    connect = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { broker, ...credentials } = connectBrokerSchema.parse(
                req.body
            );

            const result = await this.brokerService.connectAccount(
                req.userId!,
                broker,
                credentials
            );

            new ApiResponse(
                true,
                "Broker account connected successfully.",
                result
            ).send(res);
        } catch (error) {
            next(error);
        }
    };

    disconnect = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { broker } = brokerParamSchema.parse(req.params);

            const result = await this.brokerService.disconnectAccount(
                req.userId!,
                broker
            );

            new ApiResponse(
                true,
                "Broker account disconnected.",
                result
            ).send(res);
        } catch (error) {
            next(error);
        }
    };

    list = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const result = await this.brokerService.listAccounts(
                req.userId!
            );

            new ApiResponse(
                true,
                "Connected broker accounts fetched.",
                result
            ).send(res);
        } catch (error) {
            next(error);
        }
    };

    sync = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { broker } = brokerParamSchema.parse(req.params);

            const result = await this.brokerService.syncTrades(
                req.userId!,
                broker
            );

            new ApiResponse(
                true,
                "Broker sync completed.",
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
            const { page, limit } = syncHistoryQuerySchema.parse(req.query);

            const result = await this.brokerService.getSyncHistory(
                req.userId!,
                page,
                limit
            );

            new ApiResponse(
                true,
                "Sync history fetched.",
                result
            ).send(res);
        } catch (error) {
            next(error);
        }
    };

    getSyncLog = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const result = await this.brokerService.getSyncLogById(
                (req.params.id as string),
                req.userId!
            );

            new ApiResponse(
                true,
                "Sync log fetched.",
                result
            ).send(res);
        } catch (error) {
            next(error);
        }
    };
}
