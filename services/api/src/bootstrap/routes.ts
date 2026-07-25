import { Express } from "express";

import healthRoutes from "../modules/health/routes/health.routes.js";
import authRoutes from "../modules/auth/routes/auth.routes.js";
import userRoutes from "../modules/user/routes/user.routes.js";
import { env } from "../config/env.js";
import tradeRoutes from "../modules/trade/routes/trade.routes.js";
import strategyRoutes from "../modules/strategy/routes/strategy.routes.js";
import tagRoutes from "../modules/tag/routes/tag.routes.js";
import mistakeRoutes from "../modules/mistake/routes/mistake.routes.js";
import dashboardRoutes from "../modules/dashboard/routes/dashboard.routes.js";
import calculatorRoutes from "../modules/calculator/routes/calculator.routes.js";
import { csvRoutes } from "../modules/csv/index.js";
import { brokerRoutes } from "../modules/broker/index.js";
import { portfolioRoutes } from "../modules/portfolio/index.js";
import { notificationRoutes } from "../modules/notification/index.js";
import { subscriptionRoutes } from "../modules/subscription/index.js";
import { settingsRoutes } from "../modules/settings/index.js";
import { aiRoutes } from "../modules/ai/index.js";
import { marketRoutes } from "../modules/market/index.js";

export function registerRoutes(app: Express) {
  app.use(`${env.API_PREFIX}/health`, healthRoutes);
  app.use(`${env.API_PREFIX}/auth`, authRoutes);
  app.use(`${env.API_PREFIX}/users`, userRoutes);
  app.use(`${env.API_PREFIX}/trades`, tradeRoutes);
  app.use(`${env.API_PREFIX}/strategies`, strategyRoutes);
  app.use(`${env.API_PREFIX}/tags`, tagRoutes);
  app.use(`${env.API_PREFIX}/mistakes`, mistakeRoutes);
  app.use(`${env.API_PREFIX}/dashboard`, dashboardRoutes);
  app.use(`${env.API_PREFIX}/calculator`, calculatorRoutes);
  app.use(`${env.API_PREFIX}/csv`, csvRoutes);
  app.use(`${env.API_PREFIX}/broker`, brokerRoutes);
  app.use(`${env.API_PREFIX}/portfolio`, portfolioRoutes);
  app.use(`${env.API_PREFIX}/notifications`, notificationRoutes);
  app.use(`${env.API_PREFIX}/subscription`, subscriptionRoutes);
  app.use(`${env.API_PREFIX}/settings`, settingsRoutes);
  app.use(`${env.API_PREFIX}/ai`, aiRoutes);
  app.use(`${env.API_PREFIX}/market`, marketRoutes);
}
