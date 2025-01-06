import express, { NextFunction } from "express";
import authRoutes from "./auth";
import tourRoutes from "./tour";
import checkPointRoutes from "./checkpoint";
import { auth } from "../middlewares/auth";
import isTourGuide from "../middlewares/tour-guide";
import ApiError from "../utils/apiError";
import { NOT_FOUND } from "http-status";

const router = express.Router();
export default router;

router.use("/auth", authRoutes);
router.use("/tour", [auth], tourRoutes);
router.use("/checkpoint", [auth, isTourGuide], checkPointRoutes);
router.use("*", (_req, _res, next: NextFunction) =>
  next(new ApiError(NOT_FOUND, "Route nicht gefunden"))
);
