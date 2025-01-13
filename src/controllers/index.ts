import * as authController from "./auth.control";
import * as tourController from "./tour.control";
import * as checkPointController from "./checkpoint.control";
import * as albumController from "./album.control";

export default {
  auth: authController,
  tour: tourController,
  cp: checkPointController,
  album: albumController,
};
