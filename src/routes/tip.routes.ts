import express from "express";
import { validate } from "../middlewares/validation";
import { tipSchema } from "../schema/tip.schema";
import controllers from "../controllers";

const router = express.Router();
export default router;

router.post("/", validate(tipSchema), controllers.tip.postTip);
