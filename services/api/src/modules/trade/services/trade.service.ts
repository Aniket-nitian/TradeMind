import { AppError } from "../../../shared/exceptions/AppError.js";
import { calculateTradeMetrics } from "../../../shared/utils/tradeCalculator.js";
import { tradeRepository } from "../repositories/trade.repository.js";
import { authRepository } from "../../auth/repositories/auth.repository.js";
import { SubscriptionPlan } from "../../../generated/prisma/enums.js";
import type {
  CreateChecklistDto,
  CreateTradeInput,
  UpdateChecklistDto,
  UpdateEmotionDto,
  UpdateJournalDto,
  UpdateTradeInput,
} from "../validations/trade.validation.js";

const FREE_PLAN_TRADE_LIMIT = 50;

export class TradeService {
  async create(userId: string, data: CreateTradeInput) {
    const user = await authRepository.findUserById(userId);

    if (user && user.subscription !== SubscriptionPlan.PREMIUM) {
      const tradeCount = await tradeRepository.countByUser(userId);

      if (tradeCount >= FREE_PLAN_TRADE_LIMIT) {
        throw new AppError(
          `Free plan is limited to ${FREE_PLAN_TRADE_LIMIT} trades. Upgrade to Premium for unlimited trades.`,
          403
        );
      }
    }

    const calculated = calculateTradeMetrics(data);

    return tradeRepository.create(userId, {
      ...data,
      ...calculated,
    });
  }

  async getAll(
  userId: string,
  page = 1,
  limit = 20
) {
  return tradeRepository.findAll(
    userId,
    page,
    limit
  );
}

  async search(userId: string, query: string, limit = 8) {
    return tradeRepository.search(userId, query, limit);
  }

  async getOne(id: string, userId: string) {
    const trade = await tradeRepository.findById(id, userId);

    if (!trade) {
      throw new AppError("Trade not found", 404);
    }

    return trade;
  }

  async update(
    id: string,
    userId: string,
    data: UpdateTradeInput
  ) {
    const existing = await tradeRepository.findById(id, userId);

    if (!existing) {
      throw new AppError("Trade not found", 404);
    }

    const merged = {
      quantity: data.quantity ?? existing.quantity,
      entryPrice: data.entryPrice ?? existing.entryPrice,
      exitPrice: data.exitPrice ?? existing.exitPrice ?? undefined,
      exitTime:
        data.exitTime ??
        existing.exitTime?.toISOString() ??
        undefined,
      stopLoss: data.stopLoss ?? existing.stopLoss ?? undefined,
      target: data.target ?? existing.target ?? undefined,
      brokerage: data.brokerage ?? existing.brokerage,
      taxes: data.taxes ?? existing.taxes,
    };

    const calculated = calculateTradeMetrics(merged);

    return tradeRepository.update(id, userId, {
      ...data,
      ...calculated,
    });
  }

  async delete(id: string, userId: string) {
    await this.getOne(id, userId);

    return tradeRepository.softDelete(id, userId);
  }
  async updateJournal(
  tradeId: string,
  userId: string,
  data: UpdateJournalDto
) {
  const trade = await tradeRepository.findById(tradeId, userId);

  if (!trade) {
    throw new AppError("Trade not found.", 404);
  }

  await tradeRepository.updateJournal(tradeId, userId, data);

  return tradeRepository.getJournal(tradeId, userId);
}

async getJournal(
  tradeId: string,
  userId: string
) {
  const journal = await tradeRepository.getJournal(
    tradeId,
    userId
  );

  if (!journal) {
    throw new AppError("Trade not found.", 404);
  }

  return journal;
}
async getTradeDetails(
  tradeId: string,
  userId: string
) {
  const trade = await tradeRepository.getTradeDetails(
    tradeId,
    userId
  );

  if (!trade) {
    throw new AppError("Trade not found.", 404);
  }

  return {
    ...trade,

    tags: trade.tags.map((item) => item.tag),

    mistakes: trade.tradeMistakes.map(
      (item) => item.mistake
    ),

    checklist: trade.tradeChecklists,

    tradeMistakes: undefined,
    tradeChecklists: undefined,
  };
}

async createChecklistItem(
  tradeId: string,
  userId: string,
  data: CreateChecklistDto
) {
  const trade = await tradeRepository.findById(
    tradeId,
    userId
  );

  if (!trade) {
    throw new AppError("Trade not found.", 404);
  }

  return tradeRepository.createChecklistItem({
    tradeId,
    title: data.title,
  });
}

async getChecklist(
  tradeId: string,
  userId: string
) {
  const trade = await tradeRepository.findById(
    tradeId,
    userId
  );

  if (!trade) {
    throw new AppError("Trade not found.", 404);
  }

  return tradeRepository.getChecklist(
    tradeId,
    userId
  );
}

async updateChecklistItem(
  checklistId: string,
  userId: string,
  data: UpdateChecklistDto
) {
  const checklist =
    await tradeRepository.getChecklistItem(
      checklistId,
      userId
    );

  if (!checklist) {
    throw new AppError(
      "Checklist item not found.",
      404
    );
  }

  return tradeRepository.updateChecklistItem(
    checklistId,
    data
  );
}

async deleteChecklistItem(
  checklistId: string,
  userId: string
) {
  const checklist =
    await tradeRepository.getChecklistItem(
      checklistId,
      userId
    );

  if (!checklist) {
    throw new AppError(
      "Checklist item not found.",
      404
    );
  }

  await tradeRepository.deleteChecklistItem(
    checklistId
  );

  return {
    success: true,
    message: "Checklist item deleted successfully.",
  };
}

async updateEmotions(
  tradeId: string,
  userId: string,
  data: UpdateEmotionDto
) {
  const trade = await tradeRepository.findById(
    tradeId,
    userId
  );

  if (!trade) {
    throw new AppError("Trade not found.", 404);
  }

  await tradeRepository.updateEmotions(
    tradeId,
    userId,
    data
  );

  return tradeRepository.getEmotions(
    tradeId,
    userId
  );
}

async getEmotions(
  tradeId: string,
  userId: string
) {
  const emotions =
    await tradeRepository.getEmotions(
      tradeId,
      userId
    );

  if (!emotions) {
    throw new AppError("Trade not found.", 404);
  }

  return emotions;
}

async getPendingEmbeddings(userId: string) {
  return tradeRepository.findPendingEmbeddings(userId);
}

async saveEmbedding(
  tradeId: string,
  userId: string,
  embedding: number[]
) {
  const trade = await tradeRepository.findById(
    tradeId,
    userId
  );

  if (!trade) {
    throw new AppError("Trade not found.", 404);
  }

  await tradeRepository.saveEmbedding(
    tradeId,
    userId,
    embedding
  );

  return { success: true };
}

async getEmbeddedTrades(userId: string) {
  return tradeRepository.findEmbeddedTrades(userId);
}
}

export const tradeService = new TradeService();