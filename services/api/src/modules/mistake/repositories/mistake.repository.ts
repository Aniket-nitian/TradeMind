import { prisma } from "../../../shared/database/prisma.js";

class MistakeRepository {

  async create(data: {
    userId: string;
    name: string;
    description?: string;
  }) {
    return prisma.mistake.create({
      data,
    });
  }

  async findAll(userId: string) {
    return prisma.mistake.findMany({
      where: {
        userId,
        deletedAt: null,
      },
      orderBy: {
        name: "asc",
      },
    });
  }

  async findById(id: string, userId: string) {
    return prisma.mistake.findFirst({
      where: {
        id,
        userId,
        deletedAt: null,
      },
    });
  }

  async findByName(userId: string, name: string) {
    return prisma.mistake.findFirst({
      where: {
        userId,
        name,
        deletedAt: null,
      },
    });
  }

  async update(
    id: string,
    data: {
      name?: string;
      description?: string;
    }
  ) {
    return prisma.mistake.update({
      where: {
        id,
      },
      data,
    });
  }

  async delete(id: string) {
    return prisma.mistake.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  async attachMistake(tradeId: string, mistakeId: string) {
    return prisma.tradeMistake.create({
      data: {
        tradeId,
        mistakeId,
      },
    });
  }

  async removeMistake(tradeId: string, mistakeId: string) {
    return prisma.tradeMistake.delete({
      where: {
        tradeId_mistakeId: {
          tradeId,
          mistakeId,
        },
      },
    });
  }

  async findTradeMistake(
    tradeId: string,
    mistakeId: string
  ) {
    return prisma.tradeMistake.findUnique({
      where: {
        tradeId_mistakeId: {
          tradeId,
          mistakeId,
        },
      },
    });
  }

  async getTradeMistakes(tradeId: string) {
    return prisma.tradeMistake.findMany({
      where: {
        tradeId,
      },
      include: {
        mistake: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }
}

export const mistakeRepository = new MistakeRepository();