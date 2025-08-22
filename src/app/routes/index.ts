import { Router } from "express";
import { authRoutes } from "../modules/auth/auth.route";
import { contactRoutes } from "../modules/contact/contact.routes";
import { otpRoutes } from "../modules/otp/otp.routes";
import { statsRoutes } from "../modules/stats/stats.routes";
import { transactionRoutes } from "../modules/transactions/transaction.route";
import { userRoutes } from "../modules/user/user.route";
import { walletRoutes } from "../modules/wallet/wallet.routes";

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
  {
    path: "/stats",
    route: statsRoutes,
  },
  {
    path: "/contact-us",
    route: contactRoutes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
