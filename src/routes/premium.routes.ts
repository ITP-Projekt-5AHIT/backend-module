import { Router } from "express";
import controllers from "../controllers";
import { isPremium } from "../middlewares/premium";

const router = Router();
export default router;

router.post("/", controllers.premium.postSubscribePremium);
