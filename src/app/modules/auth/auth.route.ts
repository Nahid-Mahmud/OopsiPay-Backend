import { Router } from "express";
import { authController } from "./auth.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { userLoginJodValidation } from "./auth.validation";

const router = Router();

router.post("/login", validateRequest(userLoginJodValidation), authController.credentialLogin);
router.post("/refresh-token", authController.generateAccessTokenFromRefreshToken);
export const authRoutes = router;
