

import { mistakeRepository } from "../repositories/mistake.repository.js";
import { tradeRepository } from "../../trade/repositories/trade.repository.js";

import type {
  CreateMistakeDto,
  UpdateMistakeDto,
} from "../validations/mistake.validation.js";
import { AppError } from "../../../shared/exceptions/AppError.js";

class MistakeService {

  async create(userId: string, data: CreateMistakeDto) {
    const existing = await mistakeRepository.findByName(
      userId,
      data.name
    );

    if (existing) {
      throw new AppError("Mistake already exists.", 409);
    }

    return mistakeRepository.create({
      userId,
      ...data,
    });
  }

  async getAll(userId: string) {
    return mistakeRepository.findAll(userId);
  }

  async getById(userId: string, mistakeId: string) {
    const mistake = await mistakeRepository.findById(
      mistakeId,
      userId
    );

    if (!mistake) {
      throw new AppError("Mistake not found.", 404);
    }

    return mistake;
  }

  async update(
    userId: string,
    mistakeId: string,
    data: UpdateMistakeDto
  ) {
    const mistake = await mistakeRepository.findById(
      mistakeId,
      userId
    );

    if (!mistake) {
      throw new AppError("Mistake not found.", 404);
    }

    if (data.name) {
      const existing = await mistakeRepository.findByName(
        userId,
        data.name
      );

      if (existing && existing.id !== mistakeId) {
        throw new AppError(
          "Mistake name already exists.",
          409
        );
      }
    }

    return mistakeRepository.update(mistakeId, data);
  }

  async delete(userId: string, mistakeId: string) {
    const mistake = await mistakeRepository.findById(
      mistakeId,
      userId
    );

    if (!mistake) {
      throw new AppError("Mistake not found.", 404);
    }

    await mistakeRepository.delete(mistakeId);

    return {
      success: true,
      message: "Mistake deleted successfully.",
    };
  }

  async attachMistake(
    userId: string,
    tradeId: string,
    mistakeId: string
  ) {
    const trade = await tradeRepository.findById(
      tradeId,
      userId
    );

    if (!trade) {
      throw new AppError("Trade not found.", 404);
    }

    const mistake = await mistakeRepository.findById(
      mistakeId,
      userId
    );

    if (!mistake) {
      throw new AppError("Mistake not found.", 404);
    }

    const existing =
      await mistakeRepository.findTradeMistake(
        tradeId,
        mistakeId
      );

    if (existing) {
      throw new AppError(
        "Mistake already attached.",
        409
      );
    }

    return mistakeRepository.attachMistake(
      tradeId,
      mistakeId
    );
  }

  async removeMistake(
    userId: string,
    tradeId: string,
    mistakeId: string
  ) {
    const trade = await tradeRepository.findById(
      tradeId,
      userId
    );

    if (!trade) {
      throw new AppError("Trade not found.", 404);
    }

    const existing =
      await mistakeRepository.findTradeMistake(
        tradeId,
        mistakeId
      );

    if (!existing) {
      throw new AppError(
        "Mistake is not attached.",
        404
      );
    }

    await mistakeRepository.removeMistake(
      tradeId,
      mistakeId
    );

    return {
      success: true,
      message: "Mistake removed successfully.",
    };
  }

  async getTradeMistakes(
    userId: string,
    tradeId: string
  ) {
    const trade = await tradeRepository.findById(
      tradeId,
      userId
    );

    if (!trade) {
      throw new AppError("Trade not found.", 404);
    }

    return mistakeRepository.getTradeMistakes(
      tradeId
    );
  }
}

export const mistakeService = new MistakeService();