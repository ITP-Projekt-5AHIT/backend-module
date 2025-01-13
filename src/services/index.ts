import * as authService from "./auth.service";
import * as tourService from "./tour.service";
import * as checkPointService from "./checkpoint.service";
import * as locationService from "./location.service";
import * as mailService from "./mail.service";

export default {
  auth: authService,
  tour: tourService,
  cp: checkPointService,
  loc: locationService,
  mail: mailService,
};
