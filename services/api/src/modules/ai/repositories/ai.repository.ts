import { prisma } from "../../../shared/database/prisma.js";
import type {
  AddMessageInput,
  CreateConversationInput,
} from "../validations/ai.validation.js";

export class AiRepository {
  async createConversation(
    userId: string,
    data: CreateConversationInput
  ) {
    return prisma.aIConversation.create({
      data: {
        userId,
        title: data.title,
        contextType: data.contextType,
      },
    });
  }

  async listConversations(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [conversations, total] = await prisma.$transaction([
      prisma.aIConversation.findMany({
        where: { userId, deletedAt: null },
        skip,
        take: limit,
        orderBy: { updatedAt: "desc" },
      }),

      prisma.aIConversation.count({
        where: { userId, deletedAt: null },
      }),
    ]);

    return {
      conversations,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrevious: page > 1,
      },
    };
  }

  async findConversation(id: string, userId: string) {
    return prisma.aIConversation.findFirst({
      where: { id, userId, deletedAt: null },
      include: {
        messages: {
          where: { deletedAt: null },
          orderBy: { createdAt: "asc" },
        },
      },
    });
  }

  async touchConversation(id: string) {
    return prisma.aIConversation.update({
      where: { id },
      data: { updatedAt: new Date() },
    });
  }

  async addMessage(conversationId: string, data: AddMessageInput) {
    return prisma.aIMessage.create({
      data: {
        conversationId,
        role: data.role,
        content: data.content,
      },
    });
  }

  async softDeleteConversation(id: string) {
    return prisma.aIConversation.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async getRecentMessages(userId: string, limit = 40) {
    const messages = await prisma.aIMessage.findMany({
      where: {
        deletedAt: null,
        conversation: { userId, deletedAt: null },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      select: { role: true, content: true, createdAt: true },
    });

    return messages.reverse();
  }

  async getMemory(userId: string) {
    return prisma.aiMemory.findUnique({
      where: { userId },
    });
  }

  async upsertMemory(userId: string, summary: string) {
    return prisma.aiMemory.upsert({
      where: { userId },
      create: { userId, summary },
      update: { summary },
    });
  }
}

export const aiRepository = new AiRepository();
