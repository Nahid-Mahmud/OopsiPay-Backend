import { StatusCodes } from "http-status-codes";
import { redisClient } from "../config/redis.config";
import AppError from "../errorHelpers/AppError";
import User from "../modules/user/user.model";

const verifyOtp = async (email: string, otp: string): Promise<boolean> => {
  // Find the user
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }
  if (user.isVerified) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User is already verified");
  }

  // Verify OTP from Redis
  const redisKey = `otp:${email}`;
  const savedOtp = await redisClient.get(redisKey);
  if (!savedOtp) {
    throw new AppError(StatusCodes.UNAUTHORIZED, "OTP has expired or does not exist");
  }
  if (savedOtp !== otp) {
    throw new AppError(StatusCodes.UNAUTHORIZED, "Invalid OTP");
  }

  // Delete OTP from Redis
  await redisClient.del(redisKey);

  // Return true to indicate successful validation
  return true;
};

export default verifyOtp;
