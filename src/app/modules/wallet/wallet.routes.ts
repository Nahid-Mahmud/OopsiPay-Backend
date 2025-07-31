import { Router } from "express";
import { walletController } from "./wallet.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { UserRole } from "../user/user.interface";

const router = Router();

router.patch("/type/:walletId", checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN), walletController.updateWalletType);
router.get("/me", checkAuth(...Object.values(UserRole)), walletController.getMyWallet);
router.get("/get-all", checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN), walletController.getAllWallets);
//  get wallet by userId
router.get("/:userId", checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN), walletController.getWalletByUserId);

export const walletRoutes = router;
