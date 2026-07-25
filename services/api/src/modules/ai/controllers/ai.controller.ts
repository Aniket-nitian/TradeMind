import { Request, Response, NextFunction } from "express";
import { aiService } from "../services/ai.service.js";
import { ApiResponse } from "../../../shared/response/api-response.js";
import {
  addMessageSchema,
  createConversationSchema,
  upsertMemorySchema,
} from "../validations/ai.validation.js";

export class AiController {
  createConversation = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const data = createConversationSchema.parse(req.body);

      const result = await aiService.createConversation(
        req.userId!,
        data
      );

      new ApiResponse(
        true,
        "Conversation created successfully.",
        result
      ).send(res, 201);
    } catch (error) {
      next(error);
    }
  };

  listConversations = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const page = Number(req.query.page ?? 1);
      const limit = Number(req.query.limit ?? 20);

      const result = await aiService.listConversations(
        req.userId!,
        page,
        limit
      );

      new ApiResponse(
        true,
        "Conversations fetched successfully.",
        result
      ).send(res);
    } catch (error) {
      next(error);
    }
  };

  getConversation = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const result = await aiService.getConversation(
        req.params.id as string,
        req.userId!
      );

      new ApiResponse(
        true,
        "Conversation fetched successfully.",
        result
      ).send(res);
    } catch (error) {
      next(error);
    }
  };

  addMessage = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const data = addMessageSchema.parse(req.body);

      const result = await aiService.addMessage(
        req.params.id as string,
        req.userId!,
        data
      );

      new ApiResponse(
        true,
        "Message added successfully.",
        result
      ).send(res, 201);
    } catch (error) {
      next(error);
    }
  };

  deleteConversation = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const result = await aiService.deleteConversation(
        req.params.id as string,
        req.userId!
      );

      new ApiResponse(
        true,
        "Conversation deleted successfully.",
        result
      ).send(res);
    } catch (error) {
      next(error);
    }
  };

  getRecentMessages = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const limit = Number(req.query.limit ?? 40);

      const result = await aiService.getRecentMessages(
        req.userId!,
        limit
      );

      new ApiResponse(
        true,
        "Recent messages fetched successfully.",
        result
      ).send(res);
    } catch (error) {
      next(error);
    }
  };

  getMemory = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const result = await aiService.getMemory(req.userId!);

      new ApiResponse(
        true,
        "Memory fetched successfully.",
        result
      ).send(res);
    } catch (error) {
      next(error);
    }
  };

  upsertMemory = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const data = upsertMemorySchema.parse(req.body);

      const result = await aiService.upsertMemory(
        req.userId!,
        data.summary
      );

      new ApiResponse(
        true,
        "Memory updated successfully.",
        result
      ).send(res);
    } catch (error) {
      next(error);
    }
  };
}
