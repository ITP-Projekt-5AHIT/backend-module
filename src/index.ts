import app from "./server";
import config from "./config/config";

export const server = app.listen(config.PORT, () => {
  console.log(`🚀 Server started on PORT ${config.PORT}`);
});
