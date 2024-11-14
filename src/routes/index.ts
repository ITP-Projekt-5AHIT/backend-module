import express from "express";
import authRoutes from "./auth";

const router = express.Router();
export default router;

router.use("/auth", authRoutes);
