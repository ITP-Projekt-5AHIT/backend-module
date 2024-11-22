import express from "express";
import controllers from "../../controllers";
import { validate } from "../../middlewares/validation";
import {
  loginSchema,
  renewTokenSchema,
  requestPasswordResetSchema,
  setPasswordSchema,
  signUpSchema,
} from "../../schema/auth";

const router = express.Router();
export default router;

router.post("/signup", [validate(signUpSchema)], controllers.auth.postSignUp);
router.post("/login", [validate(loginSchema)], controllers.auth.postLogin);
router.get(
  "/reset/:userName",
  [validate(requestPasswordResetSchema)],
  controllers.auth.postRequestPasswordReset
);
router.post(
  "/reset",
  [validate(setPasswordSchema)],
  controllers.auth.postPasswordReset
);
router.post(
  "/renew",
  [validate(renewTokenSchema)],
  controllers.auth.postRenewToken
);
