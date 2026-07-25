import { Emotion } from "../../../generated/prisma/enums.js";
import type { Prisma } from "../../../generated/prisma/client.js";
import { prisma } from "../../../shared/database/prisma.js";
import type { CreateTradeInput, UpdateTradeInput } from "../validations/trade.validation.js";

export class TradeRepository {
  async countByUser(userId: string) {
    return prisma.trade.count({
      where: {
        userId,
        deletedAt: null,
      },
    });
  }

  async create(userId: string, data: CreateTradeInput) {
    return prisma.trade.create({
      data: {
        userId,
        ...data,
        entryTime: new Date(data.entryTime),
        exitTime: data.exitTime ? new Date(data.exitTime) : null,
      } as Prisma.TradeUncheckedCreateInput,
      include: {
        strategy: true,
        tags: {
          include: {
            tag: true,
          },
        },
        images: true,
      },
    });
  }

  async findAll(
  userId: string,
  page = 1,
  limit = 20
) {
  const skip = (page - 1) * limit;

  const [trades, total] =
    await prisma.$transaction([
      prisma.trade.findMany({
        where: {
          userId,
          deletedAt: null,
        },
        skip,
        take: limit,
        orderBy: {
          entryTime: "desc",
        },
        include: {
          strategy: true,
          tags: {
            include: {
              tag: true,
            },
          },
          images: true,
        },
      }),

      prisma.trade.count({
        where: {
          userId,
          deletedAt: null,
        },
      }),
    ]);

  return {
    trades,
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

  async search(userId: string, query: string, limit = 8) {
    return prisma.trade.findMany({
      where: {
        userId,
        deletedAt: null,
        OR: [
          { symbol: { contains: query, mode: "insensitive" } },
          { reasonForEntry: { contains: query, mode: "insensitive" } },
          { tradeNotes: { contains: query, mode: "insensitive" } },
        ],
      },
      take: limit,
      orderBy: {
        entryTime: "desc",
      },
      select: {
        id: true,
        symbol: true,
        side: true,
        status: true,
        entryTime: true,
        netPnl: true,
      },
    });
  }

  async findById(id: string, userId: string) {
    return prisma.trade.findFirst({
      where: {
        id,
        userId,
        deletedAt: null,
      },
      include: {
        strategy: true,
        tags: {
          include: {
            tag: true,
          },
        },
        images: true,
      },
    });
  }

  async update(
    id: string,
    userId: string,
    data: UpdateTradeInput
  ) {
    return prisma.trade.update({
      where: {
        id,
        userId,
      },
      data: {
        ...data,
        entryTime: data.entryTime
          ? new Date(data.entryTime)
          : undefined,
        exitTime: data.exitTime
          ? new Date(data.exitTime)
          : undefined,
      } as Prisma.TradeUncheckedUpdateInput,
    });
  }

  async softDelete(id: string, userId: string) {
    return prisma.trade.update({
      where: {
        id,
        userId,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  async updateJournal(
  tradeId: string,
  userId: string,
  data: {
    tradeNotes?: string;
    lessonLearned?: string;
    reasonForEntry?: string;
    reasonForExit?: string;
    followedPlan?: boolean;
  }
) {
  return prisma.trade.updateMany({
    where: {
      id: tradeId,
      userId,
      deletedAt: null,
    },
    data,
  });
}

async getJournal(
  tradeId: string,
  userId: string
) {
  return prisma.trade.findFirst({
    where: {
      id: tradeId,
      userId,
      deletedAt: null,
    },
    select: {
      id: true,
      tradeNotes: true,
      lessonLearned: true,
      reasonForEntry: true,
      reasonForExit: true,
      followedPlan: true,
      updatedAt: true,
    },
  });
}

async getTradeDetails(
  tradeId: string,
  userId: string
) {
  return prisma.trade.findFirst({
    where: {
      id: tradeId,
      userId,
      deletedAt: null,
    },

    include: {
      strategy: true,

      images: {
        where: {
          deletedAt: null,
        },
        orderBy: {
          createdAt: "asc",
        },
      },

      tags: {
        include: {
          tag: true,
        },
      },

      tradeMistakes: {
        include: {
          mistake: true,
        },
      },

      tradeChecklists: {
        where: {
          deletedAt: null,
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });
}

async createChecklistItem(data: {
  tradeId: string;
  title: string;
}) {
  return prisma.tradeChecklist.create({
    data,
  });
}

async getChecklist(
  tradeId: string,
  userId: string
) {
  return prisma.tradeChecklist.findMany({
    where: {
      tradeId,
      deletedAt: null,
      trade: {
        userId,
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });
}

async getChecklistItem(
  id: string,
  userId: string
) {
  return prisma.tradeChecklist.findFirst({
    where: {
      id,
      deletedAt: null,
      trade: {
        userId,
      },
    },
  });
}

async updateChecklistItem(
  id: string,
  data: {
    title?: string;
    isChecked?: boolean;
  }
) {
  return prisma.tradeChecklist.update({
    where: {
      id,
    },
    data,
  });
}

async deleteChecklistItem(id: string) {
  return prisma.tradeChecklist.update({
    where: {
      id,
    },
    data: {
      deletedAt: new Date(),
    },
  });
}

async updateEmotions(
  tradeId: string,
  userId: string,
  data: {
    emotionBefore?: Emotion;
    emotionAfter?: Emotion;
  }
) {
  return prisma.trade.updateMany({
    where: {
      id: tradeId,
      userId,
      deletedAt: null,
    },
    data,
  });
}

async getEmotions(
  tradeId: string,
  userId: string
) {
  return prisma.trade.findFirst({
    where: {
      id: tradeId,
      userId,
      deletedAt: null,
    },
    select: {
      id: true,
      emotionBefore: true,
      emotionAfter: true,
      updatedAt: true,
    },
  });
}

async findPendingEmbeddings(userId: string) {
  return prisma.trade.findMany({
    where: {
      userId,
      deletedAt: null,
      embeddedAt: null,
      OR: [
        { tradeNotes: { not: null } },
        { lessonLearned: { not: null } },
        { reasonForEntry: { not: null } },
        { reasonForExit: { not: null } },
      ],
    },
    select: {
      id: true,
      symbol: true,
      reasonForEntry: true,
      reasonForExit: true,
      tradeNotes: true,
      lessonLearned: true,
    },
  });
}

async saveEmbedding(
  tradeId: string,
  userId: string,
  embedding: number[]
) {
  return prisma.trade.updateMany({
    where: {
      id: tradeId,
      userId,
      deletedAt: null,
    },
    data: {
      embedding,
      embeddedAt: new Date(),
    },
  });
}

async findEmbeddedTrades(userId: string) {
  return prisma.trade.findMany({
    where: {
      userId,
      deletedAt: null,
      embeddedAt: { not: null },
    },
    select: {
      id: true,
      symbol: true,
      entryTime: true,
      netPnl: true,
      reasonForEntry: true,
      reasonForExit: true,
      tradeNotes: true,
      lessonLearned: true,
      embedding: true,
    },
  });
}
}

export const tradeRepository = new TradeRepository();