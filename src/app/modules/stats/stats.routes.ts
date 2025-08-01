import { Router } from "express";
import { statsController } from "./stats.controller";

const router = Router();

router.get("/user", statsController.getUserStats);
router.get("/transactions", statsController.transactionType);

export const statsRoutes = router;
