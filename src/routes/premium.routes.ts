import { Router } from "express";
import controllers from "../controllers";

const router = Router();
export default router;

router.get("/", controllers.premium.getSubscribePremium);
// verify payment gone through
router.post("/", controllers.premium.postVerifyPremium);
