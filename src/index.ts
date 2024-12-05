import app from "./server";
import config from "./config/config";
import { getHealthCheck } from "./utils/db";

export const server = app.listen(config.PORT, async () => {
  console.log(`🚀 Server started on PORT ${config.PORT}`);
  await getHealthCheck();
  console.log("💭 DB verbunden")
});
