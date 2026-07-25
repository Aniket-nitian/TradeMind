import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";

import { registerRoutes } from "./bootstrap/routes.js";
import { setupSwagger } from "./docs/swagger.js";
import { loggerMiddleware } from "./shared/middleware/logger.middleware.js";
import { errorMiddleware } from "./shared/middlewares/error.middleware.js";
import { env } from "./config/env.js";

const app = express();

app.use(helmet());

app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));

app.use(compression());

app.use(
  express.json({
    verify: (req, _res, buf) => {
      (req as express.Request & { rawBody?: Buffer }).rawBody = buf;
    },
  })
);

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(loggerMiddleware);

setupSwagger(app);

registerRoutes(app);

app.use(errorMiddleware);

export default app;