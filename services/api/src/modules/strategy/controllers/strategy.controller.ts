import type { Request, Response } from "express";

import { strategyService } from "../services/strategy.service.js";

import {
  createStrategySchema,
  updateStrategySchema,
} from "../validations/strategy.validation.js";

type StrategyParams = {
  id: string;
};

class StrategyController {
  async create(req: Request, res: Response) {
    const data = createStrategySchema.parse(req.body);

    const strategy = await strategyService.create(req.userId, data);

    return res.status(201).json({
      success: true,
      data: strategy,
    });
  }

  async getAll(req: Request, res: Response) {
    const strategies = await strategyService.getAll(req.userId);

    return res.json({
      success: true,
      data: strategies,
    });
  }

  async getById(
    req: Request<StrategyParams>,
    res: Response
  ) {
    const strategy = await strategyService.getById(
      req.userId,
      req.params.id
    );

    return res.json({
      success: true,
      data: strategy,
    });
  }

  async update(
    req: Request<StrategyParams>,
    res: Response
  ) {
    const data = updateStrategySchema.parse(req.body);

    const strategy = await strategyService.update(
      req.userId,
      req.params.id,
      data
    );

    return res.json({
      success: true,
      data: strategy,
    });
  }

  async delete(
    req: Request<StrategyParams>,
    res: Response
  ) {
    const result = await strategyService.delete(
      req.userId,
      req.params.id
    );

    return res.json(result);
  }
}

export const strategyController = new StrategyController();