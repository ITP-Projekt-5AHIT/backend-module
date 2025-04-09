import express from "express";
import { validate } from "../middlewares/validation";
import { tipSchema, verifyTipSchema } from "../schema/tip.schema";
import controllers from "../controllers";

const router = express.Router();
export default router;

router.post("/", validate(tipSchema), controllers.tip.postTip);
router.post(
  "/verify",
  validate(verifyTipSchema),
  controllers.tip.postVerifyTip
);
router.get('/', controllers.tip.getTips);
router.get('/payout/', controllers.tip.getPayout);