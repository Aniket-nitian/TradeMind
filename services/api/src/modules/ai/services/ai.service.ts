import { AppError } from "../../../shared/exceptions/AppError.js";
import { aiRepository } from "../repositories/ai.repository.js";
import type {
  AddMessageInput,
  CreateConversationInput,
} from "../validations/ai.validation.js";

export class AiService {
  async createConversation(userId: string, data: CreateConversationInput) {
    return aiRepository.createConversation(userId, data);
  }

  async listConversations(userId: string, page = 1, limit = 20) {
    return aiRepository.listConversations(userId, page, limit);
  }

  async getConversation(id: string, userId: string) {
    const conversation = await aiRepository.findConversation(id, userId);

    if (!conversation) {
      throw new AppError("Conversation not found.", 404);
    }

    return conversation;
  }

  async addMessage(
    id: string,
    userId: string,
    data: AddMessageInput
  ) {
    const conversation = await aiRepository.findConversation(id, userId);

    if (!conversation) {
      throw new AppError("Conversation not found.", 404);
    }

    const message = await aiRepository.addMessage(id, data);

    await aiRepository.touchConversation(id);

    return message;
  }

  async deleteConversation(id: string, userId: string) {
    const conversation = await aiRepository.findConversation(id, userId);

    if (!conversation) {
      throw new AppError("Conversation not found.", 404);
    }

    await aiRepository.softDeleteConversation(id);

    return { deleted: true };
  }

  async getRecentMessages(userId: string, limit = 40) {
    return aiRepository.getRecentMessages(userId, limit);
  }

  async getMemory(userId: string) {
    const memory = await aiRepository.getMemory(userId);

    return memory ?? { summary: "" };
  }

  async upsertMemory(userId: string, summary: string) {
    return aiRepository.upsertMemory(userId, summary);
  }
}

export const aiService = new AiService();
