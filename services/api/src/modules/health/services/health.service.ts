import { prisma } from "../../../shared/database/prisma.js";

export class HealthService {
  async getHealthStatus() {
    const startedAt = Date.now();

    try {
      await prisma.$queryRaw`SELECT 1`;

      return {
        healthy: true,
        message: "TradeMind API is running 🚀",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        database: {
          status: "up" as const,
          latencyMs: Date.now() - startedAt,
        },
      };
    } catch {
      return {
        healthy: false,
        message: "TradeMind API is running, but the database is unreachable.",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        database: {
          status: "down" as const,
        },
      };
    }
  }
}

export const healthService = new HealthService();