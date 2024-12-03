import express from "express";
import controllers from "../../controllers";
import { subscribeSchema, tourSchema } from "../../schema/tour";
import { validate } from "../../middlewares/validation";

const router = express.Router();
export default router;

router.post("/", [validate(tourSchema)], controllers.tour.postCreateTour);
router.post(
  "/subscribe",
  [validate(subscribeSchema)],
  controllers.tour.postSubscribeTour
);
