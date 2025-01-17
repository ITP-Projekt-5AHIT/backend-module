import * as authSchema from "./auth.schema";
import * as checkpointSchema from "./checkpoint.schema";
import * as envSchema from "./env.schema";
import * as locationSchema from "./location.schema";
import * as tourSchema from "./tour.schema";

export default {
  auth: authSchema,
  cp: checkpointSchema,
  env: envSchema,
  location: locationSchema,
  tour: tourSchema,
};
