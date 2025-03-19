import * as authController from "./auth.control";
import * as tourController from "./tour.control";
import * as checkPointController from "./checkpoint.control";
import * as albumController from "./album.control";
import * as premiumController from "./premium.controller";
import * as tipController from "./tip.controller";

export default {
  auth: authController,
  tour: tourController,
  cp: checkPointController,
  album: albumController,
  premium: premiumController,
  tip: tipController,
};
