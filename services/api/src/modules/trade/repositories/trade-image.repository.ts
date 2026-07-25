import { prisma } from "../../../shared/database/prisma.js";
import { ImageType } from "../../../generated/prisma/enums.js";

class TradeImageRepository {
  async create(data: {
    tradeId: string;
    imageUrl: string;
    publicId: string;
    type: ImageType;
  }) {
    return prisma.tradeImage.create({
      data,
    });
  }

  async findManyByTrade(tradeId: string) {
    return prisma.tradeImage.findMany({
      where: {
        tradeId,
        deletedAt: null,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findById(id: string) {
    return prisma.tradeImage.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });
  }

  async softDelete(id: string) {
    return prisma.tradeImage.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}

export const tradeImageRepository = new TradeImageRepository();