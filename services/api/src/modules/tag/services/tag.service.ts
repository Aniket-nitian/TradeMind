

import { tagRepository } from "../repositories/tag.repository.js";
import { tradeRepository } from "../../trade/repositories/trade.repository.js";

import type {
  CreateTagDto,
  UpdateTagDto,
} from "../validations/tag.validation.js";
import { AppError } from "../../../shared/exceptions/AppError.js";

class TagService {

  async create(userId: string, data: CreateTagDto) {
    const existing = await tagRepository.findByName(userId, data.name);

    if (existing) {
      throw new AppError("Tag already exists.", 409);
    }

    return tagRepository.create({
      userId,
      ...data,
    });
  }

  async getAll(userId: string) {
    return tagRepository.findAll(userId);
  }

  async getById(userId: string, tagId: string) {
    const tag = await tagRepository.findById(tagId, userId);

    if (!tag) {
      throw new AppError("Tag not found.", 404);
    }

    return tag;
  }

  async update(
    userId: string,
    tagId: string,
    data: UpdateTagDto
  ) {
    const tag = await tagRepository.findById(tagId, userId);

    if (!tag) {
      throw new AppError("Tag not found.", 404);
    }

    if (data.name) {
      const existing = await tagRepository.findByName(
        userId,
        data.name
      );

      if (existing && existing.id !== tagId) {
        throw new AppError("Tag name already exists.", 409);
      }
    }

    return tagRepository.update(tagId, data);
  }

  async delete(userId: string, tagId: string) {
    const tag = await tagRepository.findById(tagId, userId);

    if (!tag) {
      throw new AppError("Tag not found.", 404);
    }

    await tagRepository.delete(tagId);

    return {
      success: true,
      message: "Tag deleted successfully.",
    };
  }

  async attachTag(
    userId: string,
    tradeId: string,
    tagId: string
  ) {
    const trade = await tradeRepository.findById(tradeId, userId);

    if (!trade) {
      throw new AppError("Trade not found.", 404);
    }

    const tag = await tagRepository.findById(tagId, userId);

    if (!tag) {
      throw new AppError("Tag not found.", 404);
    }

    const existing = await tagRepository.findTradeTag(
      tradeId,
      tagId
    );

    if (existing) {
      throw new AppError("Tag already attached.", 409);
    }

    return tagRepository.attachTag(tradeId, tagId);
  }

  async removeTag(
    userId: string,
    tradeId: string,
    tagId: string
  ) {
    const trade = await tradeRepository.findById(tradeId, userId);

    if (!trade) {
      throw new AppError("Trade not found.", 404);
    }

    const existing = await tagRepository.findTradeTag(
      tradeId,
      tagId
    );

    if (!existing) {
      throw new AppError("Tag is not attached.", 404);
    }

    await tagRepository.removeTag(tradeId, tagId);

    return {
      success: true,
      message: "Tag removed successfully.",
    };
  }

  async getTradeTags(
    userId: string,
    tradeId: string
  ) {
    const trade = await tradeRepository.findById(tradeId, userId);

    if (!trade) {
      throw new AppError("Trade not found.", 404);
    }

    return tagRepository.getTradeTags(tradeId);
  }
}

export const tagService = new TagService();