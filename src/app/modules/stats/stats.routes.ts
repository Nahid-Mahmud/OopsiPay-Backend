import { Router } from "express";
import { statsController } from "./stats.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { UserRole } from "../user/user.interface";

const router = Router();

router.get("/user", checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN), statsController.getUserStats);
router.get("/transactions", checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN), statsController.transactionType);

export const statsRoutes = router;
