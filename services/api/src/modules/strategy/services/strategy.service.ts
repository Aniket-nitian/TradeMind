
import { AppError } from "../../../shared/exceptions/AppError.js";
import { strategyRepository } from "../repositories/strategy.repository.js";

import type {
  CreateStrategyDto,
  UpdateStrategyDto,
} from "../validations/strategy.validation.js";

class StrategyService {
  async create(userId: string, data: CreateStrategyDto) {
    const existing = await strategyRepository.findAll(userId);

    const duplicate = existing.find(
      (strategy) =>
        strategy.name.trim().toLowerCase() ===
        data.name.trim().toLowerCase()
    );

    if (duplicate) {
      throw new AppError("Strategy with this name already exists.", 409);
    }

    return strategyRepository.create({
      userId,
      ...data,
    });
  }

  async getAll(userId: string) {
    return strategyRepository.findAll(userId);
  }

  async getById(userId: string, strategyId: string) {
    const strategy = await strategyRepository.findById(strategyId, userId);

    if (!strategy) {
      throw new AppError("Strategy not found.", 404);
    }

    return strategy;
  }

  async update(
    userId: string,
    strategyId: string,
    data: UpdateStrategyDto
  ) {
    const strategy = await strategyRepository.findById(strategyId, userId);

    if (!strategy) {
      throw new AppError("Strategy not found.", 404);
    }

    if (data.name) {
      const existing = await strategyRepository.findAll(userId);

      const duplicate = existing.find(
        (item) =>
          item.id !== strategyId &&
          item.name.trim().toLowerCase() ===
            data.name!.trim().toLowerCase()
      );

      if (duplicate) {
        throw new AppError("Strategy name already exists.", 409);
      }
    }

    return strategyRepository.update(strategyId, data);
  }

  async delete(userId: string, strategyId: string) {
    const strategy = await strategyRepository.findById(strategyId, userId);

    if (!strategy) {
      throw new AppError("Strategy not found.", 404);
    }

    await strategyRepository.delete(strategyId);

    return {
      success: true,
      message: "Strategy deleted successfully.",
    };
  }
}

export const strategyService = new StrategyService();