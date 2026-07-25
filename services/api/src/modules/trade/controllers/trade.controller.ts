import type { Request, Response } from "express";
import { tradeService } from "../services/trade.service.js";
import {
  createChecklistSchema,
  createTradeSchema,
  saveEmbeddingSchema,
  searchTradesSchema,
  updateChecklistSchema,
  updateEmotionSchema,
  updateJournalSchema,
  updateTradeSchema,
} from "../validations/trade.validation.js";
import { ApiResponse } from "../../../shared/response/api-response.js";

export class TradeController {
  async create(req: Request, res: Response) {
    const data = createTradeSchema.parse(req.body);

    const trade = await tradeService.create(
      req.userId!,
      data
    );

    return res.status(201).json({
      success: true,
      message: "Trade created successfully",
      data: trade,
    });
  }

  async getAll(req: Request, res: Response) {
  const page = Number(req.query.page ?? 1);
  const limit = Number(req.query.limit ?? 20);

  const trades = await tradeService.getAll(
    req.userId!,
    page,
    limit
  );

  return res.json({
    success: true,
    data: trades,
  });
}

  async search(req: Request, res: Response) {
    const { q, limit } = searchTradesSchema.parse(req.query);

    const trades = await tradeService.search(req.userId!, q, limit);

    return new ApiResponse(
      true,
      "Trades fetched successfully.",
      trades
    ).send(res);
  }

  async getById(req: Request, res: Response) {
    const trade = await tradeService.getOne(
      (req.params.id as string),
      req.userId!
    );

    return res.json({
      success: true,
      data: trade,
    });
  }

  async update(req: Request, res: Response) {
    const data = updateTradeSchema.parse(req.body);

    const trade = await tradeService.update(
      (req.params.id as string),
      req.userId!,
      data
    );

    return res.json({
      success: true,
      message: "Trade updated successfully",
      data: trade,
    });
  }

  async delete(req: Request, res: Response) {
    await tradeService.delete(
      (req.params.id as string),
      req.userId!
    );

    return res.json({
      success: true,
      message: "Trade deleted successfully",
    });
  }

  async updateJournal(req: Request, res: Response) {
  const data = updateJournalSchema.parse(req.body);

  const journal = await tradeService.updateJournal(
    (req.params.id as string),
    req.userId,
    data
  );

  return new ApiResponse(
    true,
    "Journal updated successfully.",
    journal
  ).send(res);
}

async getJournal(req: Request, res: Response) {
  const journal = await tradeService.getJournal(
    (req.params.id as string),
    req.userId
  );

  return new ApiResponse(
    true,
    "Journal fetched successfully.",
    journal
  ).send(res);
}
async getTradeDetails(req: Request, res: Response) {
  const trade = await tradeService.getTradeDetails(
    (req.params.id as string),
    req.userId
  );

  return new ApiResponse(
    true,
    "Trade details fetched successfully.",
    trade
  ).send(res);
}

async createChecklistItem(
  req: Request,
  res: Response
) {
  const data = createChecklistSchema.parse(
    req.body
  );

  const checklist =
    await tradeService.createChecklistItem(
      (req.params.id as string),
      req.userId,
      data
    );

  return new ApiResponse(
    true,
    "Checklist item created successfully.",
    checklist
  ).send(res, 201);
}

async getChecklist(
  req: Request,
  res: Response
) {
  const checklist =
    await tradeService.getChecklist(
      (req.params.id as string),
      req.userId
    );

  return new ApiResponse(
    true,
    "Checklist fetched successfully.",
    checklist
  ).send(res);
}

async updateChecklistItem(
  req: Request,
  res: Response
) {
  const data = updateChecklistSchema.parse(
    req.body
  );

  const checklist =
    await tradeService.updateChecklistItem(
      (req.params.id as string),
      req.userId,
      data
    );

  return new ApiResponse(
    true,
    "Checklist updated successfully.",
    checklist
  ).send(res);
}

async deleteChecklistItem(
  req: Request,
  res: Response
) {
  const result =
    await tradeService.deleteChecklistItem(
      (req.params.id as string),
      req.userId
    );

  return new ApiResponse(
    true,
    result.message
  ).send(res);
}

async updateEmotions(
  req: Request,
  res: Response
) {
  const data =
    updateEmotionSchema.parse(req.body);

  const emotions =
    await tradeService.updateEmotions(
      (req.params.id as string),
      req.userId,
      data
    );

  return new ApiResponse(
    true,
    "Trade emotions updated successfully.",
    emotions
  ).send(res);
}

async getEmotions(
  req: Request,
  res: Response
) {
  const emotions =
    await tradeService.getEmotions(
      (req.params.id as string),
      req.userId
    );

  return new ApiResponse(
    true,
    "Trade emotions fetched successfully.",
    emotions
  ).send(res);
}

async getPendingEmbeddings(
  req: Request,
  res: Response
) {
  const trades = await tradeService.getPendingEmbeddings(
    req.userId!
  );

  return new ApiResponse(
    true,
    "Pending embeddings fetched successfully.",
    trades
  ).send(res);
}

async saveEmbedding(
  req: Request,
  res: Response
) {
  const data = saveEmbeddingSchema.parse(req.body);

  const result = await tradeService.saveEmbedding(
    (req.params.id as string),
    req.userId!,
    data.embedding
  );

  return new ApiResponse(
    true,
    "Embedding saved successfully.",
    result
  ).send(res);
}

async getEmbeddedTrades(
  req: Request,
  res: Response
) {
  const trades = await tradeService.getEmbeddedTrades(
    req.userId!
  );

  return new ApiResponse(
    true,
    "Embedded trades fetched successfully.",
    trades
  ).send(res);
}
}

export const tradeController = new TradeController();