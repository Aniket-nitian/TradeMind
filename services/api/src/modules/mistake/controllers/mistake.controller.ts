import type { Request, Response } from "express";

import { mistakeService } from "../services/mistake.service.js";

import {
  createMistakeSchema,
  updateMistakeSchema,
} from "../validations/mistake.validation.js";

type MistakeParams = {
  id: string;
};

type TradeMistakeParams = {
  tradeId: string;
  mistakeId: string;
};

class MistakeController {
  async create(req: Request, res: Response) {
    const data = createMistakeSchema.parse(req.body);

    const mistake = await mistakeService.create(
      req.userId,
      data
    );

    return res.status(201).json({
      success: true,
      data: mistake,
    });
  }

  async getAll(req: Request, res: Response) {
    const mistakes =
      await mistakeService.getAll(req.userId);

    return res.json({
      success: true,
      data: mistakes,
    });
  }

  async getById(
    req: Request<MistakeParams>,
    res: Response
  ) {
    const mistake =
      await mistakeService.getById(
        req.userId,
        req.params.id
      );

    return res.json({
      success: true,
      data: mistake,
    });
  }

  async update(
    req: Request<MistakeParams>,
    res: Response
  ) {
    const data = updateMistakeSchema.parse(
      req.body
    );

    const mistake =
      await mistakeService.update(
        req.userId,
        req.params.id,
        data
      );

    return res.json({
      success: true,
      data: mistake,
    });
  }

  async delete(
    req: Request<MistakeParams>,
    res: Response
  ) {
    const result =
      await mistakeService.delete(
        req.userId,
        req.params.id
      );

    return res.json(result);
  }

  async attachMistake(
    req: Request<TradeMistakeParams>,
    res: Response
  ) {
    const result =
      await mistakeService.attachMistake(
        req.userId,
        req.params.tradeId,
        req.params.mistakeId
      );

    return res.status(201).json({
      success: true,
      data: result,
    });
  }

  async removeMistake(
    req: Request<TradeMistakeParams>,
    res: Response
  ) {
    const result =
      await mistakeService.removeMistake(
        req.userId,
        req.params.tradeId,
        req.params.mistakeId
      );

    return res.json(result);
  }

  async getTradeMistakes(
    req: Request<{ tradeId: string }>,
    res: Response
  ) {
    const mistakes =
      await mistakeService.getTradeMistakes(
        req.userId,
        req.params.tradeId
      );

    return res.json({
      success: true,
      data: mistakes,
    });
  }
}

export const mistakeController =
  new MistakeController();