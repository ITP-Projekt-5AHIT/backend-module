import app from "./server";
import config from "./config/config";
import { getHealthCheck } from "./utils/db";
import logger from "./config/logger";

export const server = app.listen(config.PORT, async () => {
  await getHealthCheck();
  logger.info(`🚀 Server started on PORT ${config.PORT}`);
  logger.info("💭 DB verbunden");
});
