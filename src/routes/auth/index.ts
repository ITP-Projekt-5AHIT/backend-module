import express from "express";
import controllers from "../../controllers";
import { validate } from "../../middlewares/validation";
import { loginSchema, signUpSchema } from "../../schema/auth";

const router = express.Router();
export default router;

router.post("/signup", [validate(signUpSchema)], controllers.auth.postSignUp);
router.post("/login", [validate(loginSchema)], controllers.auth.postLogin);
router.get('/reset/:userName', controllers.auth.postRequestPasswordReset);

