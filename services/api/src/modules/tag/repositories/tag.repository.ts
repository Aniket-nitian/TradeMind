import { prisma } from "../../../shared/database/prisma.js";

class TagRepository {

  async create(data: {
    userId: string;
    name: string;
    color?: string;
  }) {
    return prisma.tag.create({
      data,
    });
  }

  async findAll(userId: string) {
    return prisma.tag.findMany({
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
    return prisma.tag.findFirst({
      where: {
        id,
        userId,
        deletedAt: null,
      },
    });
  }

  async findByName(userId: string, name: string) {
    return prisma.tag.findFirst({
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
      color?: string;
      isActive?: boolean;
    }
  ) {
    return prisma.tag.update({
      where: {
        id,
      },
      data,
    });
  }

  async delete(id: string) {
    return prisma.tag.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  async attachTag(tradeId: string, tagId: string) {
    return prisma.tradeTag.create({
      data: {
        tradeId,
        tagId,
      },
    });
  }

  async removeTag(tradeId: string, tagId: string) {
    return prisma.tradeTag.delete({
      where: {
        tradeId_tagId: {
          tradeId,
          tagId,
        },
      },
    });
  }

  async getTradeTags(tradeId: string) {
    return prisma.tradeTag.findMany({
      where: {
        tradeId,
      },
      include: {
        tag: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findTradeTag(tradeId: string, tagId: string) {
    return prisma.tradeTag.findUnique({
      where: {
        tradeId_tagId: {
          tradeId,
          tagId,
        },
      },
    });
  }
}

export const tagRepository = new TagRepository();