import express from "express";
import authRoutes from "./auth";
import tourRoutes from "./tour";
import checkPointRoutes from "./checkpoint";
import { auth } from "../middlewares/auth";
import isTourGuide from "../middlewares/tour-guide";

const router = express.Router();
export default router;

router.use("/auth", authRoutes);
router.use("/tour", [auth], tourRoutes);
router.use("/checkpoint", [auth, isTourGuide], checkPointRoutes);
