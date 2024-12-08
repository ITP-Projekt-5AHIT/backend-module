import * as authService from "./auth";
import * as tourService from "./tour";
import * as checkPointService from "./checkpoint";

export default {
  auth: authService,
  tour: tourService,
  cp: checkPointService,
};
