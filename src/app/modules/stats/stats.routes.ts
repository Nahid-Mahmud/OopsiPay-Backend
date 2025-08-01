import { Router } from "express";
import { statsController } from "./stats.controller";

const router = Router();

router.get("/user", statsController.getUserStats);

export const statsRoutes = router;
