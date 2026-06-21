import { Router } from "express";
import driverRoutes from "./driver.routes.js";
import requestRoutes from "./request.routes.js";
import applicationRoutes from "./application.routes.js";

const router = Router();

import authRoutes from "./auth.routes.js";
router.use("/drivers", driverRoutes);
router.use("/requests", requestRoutes);
router.use("/applications", applicationRoutes);
router.use("/auth", authRoutes);

export default router;
