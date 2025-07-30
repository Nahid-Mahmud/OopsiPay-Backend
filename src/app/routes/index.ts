import { Router } from "express";
import { authRoutes } from "../modules/auth/auth.route";
import { userRoutes } from "../modules/user/user.route";
import { otpRoutes } from "../modules/otp/otp.routes";

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
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
