import { Router } from "express";
import { otpController } from "./otp.controller";

const router = Router();

router.post("/resend", otpController.sendOtp);

router.post("/verify-user", otpController.verifyOtpUser);

export const otpRoutes = router;
