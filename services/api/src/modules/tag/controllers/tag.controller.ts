import type { Request, Response } from "express";

import { tagService } from "../services/tag.service.js";

import {
  createTagSchema,
  updateTagSchema,
} from "../validations/tag.validation.js";

type TagParams = {
  id: string;
};

type TradeTagParams = {
  tradeId: string;
  tagId: string;
};

class TagController {

  async create(req: Request, res: Response) {
    const data = createTagSchema.parse(req.body);

    const tag = await tagService.create(req.userId, data);

    return res.status(201).json({
      success: true,
      data: tag,
    });
  }

  async getAll(req: Request, res: Response) {
    const tags = await tagService.getAll(req.userId);

    return res.json({
      success: true,
      data: tags,
    });
  }

  async getById(
    req: Request<TagParams>,
    res: Response
  ) {
    const tag = await tagService.getById(
      req.userId,
      req.params.id
    );

    return res.json({
      success: true,
      data: tag,
    });
  }

  async update(
    req: Request<TagParams>,
    res: Response
  ) {
    const data = updateTagSchema.parse(req.body);

    const tag = await tagService.update(
      req.userId,
      req.params.id,
      data
    );

    return res.json({
      success: true,
      data: tag,
    });
  }

  async delete(
    req: Request<TagParams>,
    res: Response
  ) {
    const result = await tagService.delete(
      req.userId,
      req.params.id
    );

    return res.json(result);
  }

  async attachTag(
    req: Request<TradeTagParams>,
    res: Response
  ) {
    const result = await tagService.attachTag(
      req.userId,
      req.params.tradeId,
      req.params.tagId
    );

    return res.status(201).json({
      success: true,
      data: result,
    });
  }

  async removeTag(
    req: Request<TradeTagParams>,
    res: Response
  ) {
    const result = await tagService.removeTag(
      req.userId,
      req.params.tradeId,
      req.params.tagId
    );

    return res.json(result);
  }

  async getTradeTags(
    req: Request<{ tradeId: string }>,
    res: Response
  ) {
    const tags = await tagService.getTradeTags(
      req.userId,
      req.params.tradeId
    );

    return res.json({
      success: true,
      data: tags,
    });
  }
}

export const tagController = new TagController();