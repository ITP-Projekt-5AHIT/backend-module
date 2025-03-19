import express, { NextFunction } from "express";
import authRoutes from "./auth.routes";
import tourRoutes from "./tour.routes";
import checkPointRoutes from "./checkpoint.routes";
import albumRoutes from "./album.routes";
import isTourGuide from "../middlewares/tour-guide";
import ApiError from "../utils/apiError";
import premiumRoutes from "./premium.routes";
import tipRoutes from "./tip.routes";
import { auth } from "../middlewares/auth";
import { NOT_FOUND } from "http-status";

const router = express.Router();
export default router;

router.use("/auth", authRoutes);
router.use("/tour", [auth], tourRoutes);
router.use("/checkpoint", [auth, isTourGuide], checkPointRoutes);
router.use("/album", [auth], albumRoutes);
router.use("/premium", [auth], premiumRoutes);
router.use("/tip", [auth], tipRoutes);
router.use("*", (_req, _res, next: NextFunction) =>
  next(new ApiError(NOT_FOUND, "Route nicht gefunden"))
);
