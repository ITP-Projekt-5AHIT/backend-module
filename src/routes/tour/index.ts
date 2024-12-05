import express from "express";
import controllers from "../../controllers";
import { subscribeSchema, tourSchema } from "../../schema/tour";
import { validate } from "../../middlewares/validation";
import isTourGuide from "../../middlewares/tour-guide";

const router = express.Router();
export default router;

router.post("/", [validate(tourSchema)], controllers.tour.postCreateTour);
router.post(
  "/subscribe",
  [validate(subscribeSchema)],
  controllers.tour.postSubscribeTour
);
router.get("/:tourId", [isTourGuide], controllers.tour.getTourDetails);
