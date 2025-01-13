import { Router } from "express";
import controllers from "../controllers";
import { validate } from "../middlewares/validation";
import {
  checkpointSchema,
  deleteCheckpointSchema,
} from "../schema/checkpoint.schema";
const router = Router();
export default router;

router.post(
  "/",
  [validate(checkpointSchema)],
  controllers.cp.postCreateCheckPoint
);
router.get("/:tourId", controllers.cp.getCheckPoints);
router.get("/next/:tourId", controllers.cp.getNextCheckPoint);
router.delete(
  "/:cId",
  [validate(deleteCheckpointSchema)],
  controllers.cp.deleteCheckpoint
);
