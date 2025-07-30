import { StatusCodes } from "http-status-codes";
import { redisClient } from "../../config/redis.config";
import AppError from "../../errorHelpers/AppError";
import { generateOtp } from "../../utils/generateOtp";
import { sendEmail } from "../../utils/sendEmail";
import User from "../user/user.model";
import verifyOtp from "../../utils/verifyOtp";

const OTP_EXPIRATION_TIME = 2 * 60; // 2 minutes in seconds

const sendOtp = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }
  if (user.isVerified) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User is already verified");
  }

  const otp = generateOtp(6);
  // store otp in redis
  const redisKey = `otp:${email}`;
  await redisClient.set(redisKey, otp, {
    expiration: {
      type: "EX",
      value: OTP_EXPIRATION_TIME,
    },
  });

  await sendEmail({
    to: email,
    subject: "Your OTP Code",
    templateName: "otp.ejs",
    templateData: {
      name: user.firstName + " " + user.lastName,
      otp: otp,
    },
  });
};

const verifyOtpUser = async (email: string, otp: string) => {
  const session = await User.startSession();
  session.startTransaction();
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError(StatusCodes.NOT_FOUND, "User not found");
    }
    if (user.isVerified) {
      throw new AppError(StatusCodes.BAD_REQUEST, "User is already verified");
    }
    await verifyOtp(email, otp);
    await User.updateOne({ email }, { isVerified: true }, { runValidators: true, session });
    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const otpServices = {
  sendOtp,
  verifyOtpUser,
};
