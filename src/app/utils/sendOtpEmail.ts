import { StatusCodes } from "http-status-codes";
import AppError from "../errorHelpers/AppError";
import User from "../modules/user/user.model";
import { generateOtp } from "./generateOtp";
import { redisClient } from "../config/redis.config";
import { sendEmail } from "./sendEmail";

export const sendOtpEmail = async ({
  email,
  expirationTimeInSeconds = 120,
}: {
  email: string;
  expirationTimeInSeconds?: number;
}) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }
  if (user.isVerified) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User is already verified");
  }

  const otp = generateOtp(6);
  // store otp in redis

  // invalid previous otp
  const previousOtp = await redisClient.get(`otp:${email}`);
  if (previousOtp) {
    await redisClient.del(`otp:${email}`);
  }

  const redisKey = `otp:${email}`;
  await redisClient.set(redisKey, otp, {
    expiration: {
      type: "EX",
      value: expirationTimeInSeconds || 120,
    },
  });

  await sendEmail({
    to: email,
    subject: "Your OTP Code",
    templateName: "otp.ejs",
    templateData: {
      name: user.firstName + " " + user.lastName,
      otp: otp,
      expiresIn: expirationTimeInSeconds / 60,
    },
  });
};
