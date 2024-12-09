import { Router } from "express";
import controllers from "../../controllers";
import { validate } from "../../middlewares/validation";
import { checkpointSchema } from "../../schema/checkpoint";
const router = Router();
export default router;

router.post(
  "/",
  [validate(checkpointSchema)],
  controllers.cp.postCreateCheckPoint
);
router.get("/:tourId", controllers.cp.getCheckPoints);
