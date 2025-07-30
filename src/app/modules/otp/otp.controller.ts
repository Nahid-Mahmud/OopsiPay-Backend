/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { otpServices } from "./otp.service";
import sendResponse from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { sendOtpEmail } from "../../utils/sendOtpEmail";

const resendOtp = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
  const { email } = req.body;

  await sendOtpEmail({
    email,
    expirationTimeInSeconds: 120, // 2 minutes
  });

  sendResponse(res, {
    success: true,
    message: "OTP sent successfully",
    statusCode: StatusCodes.OK,
    data: null,
  });
});

const verifyOtpUser = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
  const { email, otp } = req.body;
  await otpServices.verifyOtpUser(email, otp);
  sendResponse(res, {
    success: true,
    message: "OTP verified successfully",
    statusCode: StatusCodes.OK,
    data: null,
  });
});

export const otpController = {
  resendOtp,
  verifyOtpUser,
};
