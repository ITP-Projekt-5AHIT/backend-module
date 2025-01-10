import * as authService from "./auth";
import * as tourService from "./tour";
import * as checkPointService from "./checkpoint";
import * as locationService from "./location";

export default {
  auth: authService,
  tour: tourService,
  cp: checkPointService,
  loc: locationService,
};
