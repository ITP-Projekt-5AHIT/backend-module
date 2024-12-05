import express from "express";
import authRoutes from "./auth";
import tourRoutes from "./tour";
import { auth } from "../middlewares/auth";

const router = express.Router();
export default router;

router.use("/auth", authRoutes);
router.use("/tour", [auth], tourRoutes);
