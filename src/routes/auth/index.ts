import express from "express";
import controllers from "../../controllers";
import { validate } from "../../middlewares/validation";
import { signUpSchema } from "../../schema/auth";

const router = express.Router();
export default router;

router.post("/signup", [validate(signUpSchema)], controllers.auth.postSignUp);
