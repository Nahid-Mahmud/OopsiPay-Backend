import { Router } from "express";
import { transactionController } from "./transaction.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { UserRole } from "../user/user.interface";
import { validateRequest } from "../../middlewares/validateRequest";
import { createTransactionZodSchema } from "./transaction.validation";

const router = Router();

router.post(
  "/create",
  checkAuth(...Object.values(UserRole)),
  validateRequest(createTransactionZodSchema),
  transactionController.createTransaction
);

export const transactionRoutes = router;
