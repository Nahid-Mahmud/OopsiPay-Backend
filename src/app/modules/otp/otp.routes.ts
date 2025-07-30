import { Router } from "express";
import { otpController } from "./otp.controller";

const router = Router();

router.post("/send", otpController.sendOtp);

router.post("/verify-user", otpController.verifyOtpUser);

export const otpRoutes = router;
