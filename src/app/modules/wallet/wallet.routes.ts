import { Router } from "express";
import { walletController } from "./wallet.controller";

const router = Router();

router.patch("/type/:walletId", walletController.updateWalletType);

export const walletRoutes = router;
