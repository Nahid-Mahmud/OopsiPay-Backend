import { Router } from "express";
import { authRoutes } from "../modules/auth/auth.route";
import { otpRoutes } from "../modules/otp/otp.routes";
import { userRoutes } from "../modules/user/user.route";
import { walletRoutes } from "../modules/wallet/wallet.routes";
import { transactionRoutes } from "../modules/transactions/transaction.route";

export const router = Router();

interface IModuleRoute {
  path: string;
  route: Router;
}

const moduleRoutes: IModuleRoute[] = [
  {
    path: "/auth",
    route: authRoutes,
  },
  {
    path: "/user",
    route: userRoutes,
  },
  {
    path: "/otp",
    route: otpRoutes,
  },
  {
    path: "/wallet",
    route: walletRoutes,
  },
  {
    path: "/transaction",
    route: transactionRoutes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
