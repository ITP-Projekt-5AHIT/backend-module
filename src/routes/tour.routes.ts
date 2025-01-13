import express from "express";
import controllers from "../controllers";
import {
  deleteSubscriptionSchema,
  deleteTourSchema,
  subscribeSchema,
  tourSchema,
} from "../schema/tour.schema";
import { validate } from "../middlewares/validation";
import isTourGuide from "../middlewares/tour-guide";
import { queryCooridnateSchema } from "../schema/location.schema";

const router = express.Router();
export default router;

router.get("/all", controllers.tour.getUserAllTours);
router.get(
  "/distance",
  [validate(queryCooridnateSchema)],
  controllers.tour.getDistance
);
router.post("/", [validate(tourSchema)], controllers.tour.postCreateTour);
router.post(
  "/subscribe",
  [validate(subscribeSchema)],
  controllers.tour.postSubscribeTour
);
router.get("/:tourId", [isTourGuide], controllers.tour.getTourDetails);
router.delete(
  "/:tId",
  [validate(deleteTourSchema)],
  controllers.tour.deleteTour
);
router.get("/", controllers.tour.getUserTour);
router.delete(
  "/unsubscribe/:tId",
  [validate(deleteSubscriptionSchema)],
  controllers.tour.deleteTourSubscription
);
