import app from "@/app";
import { config } from "@/config";

import { logger } from "@/utils/logger";

const server = app.listen(config.port, () => {
  logger.info({
    message: `Server running on port ${config.port}`,
    config: config.experiment,
  });
});

const gracefulShutdown = (signal: string) => {
  logger.info(`Received ${signal}. Closing server gracefully...`);
  server.close(() => {
    logger.info("HTTP server closed.");
    process.exit(0);
  });

  // Force close server after 10 seconds
  setTimeout(() => {
    logger.error(
      "Could not close connections in time, forcefully shutting down",
    );
    process.exit(1);
  }, 10000);
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
