import app from "./app.js";
import { env } from "./config/env.js";
import { logger } from "./shared/logger/logger.js";
import { startScheduler } from "./bootstrap/scheduler.js";

app.listen(env.PORT, () => {
  logger.info(
    `🚀 Server running at http://localhost:${env.PORT}`
  );

  startScheduler();
});