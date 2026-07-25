import type { Request, Response } from "express";

import { tradeImageService } from "../services/trade-image.service.js";

type TradeParams = {
  tradeId: string;
};

type ImageParams = {
  imageId: string;
};

class TradeImageController {
  async upload(
    req: Request<TradeParams>,
    res: Response
  ) {
    const image = await tradeImageService.upload(
      req.userId,
      req.params.tradeId,
      req.file!,
      (req.body.type ?? "CHART") as any
    );

    return res.status(201).json({
      success: true,
      data: image,
    });
  }

  async getAll(
    req: Request<TradeParams>,
    res: Response
  ) {
    const images = await tradeImageService.getAll(
      req.userId,
      req.params.tradeId
    );

    return res.json({
      success: true,
      data: images,
    });
  }

  async delete(
    req: Request<ImageParams>,
    res: Response
  ) {
    const result = await tradeImageService.delete(
      req.userId,
      req.params.imageId
    );

    return res.json(result);
  }
}

export const tradeImageController = new TradeImageController();