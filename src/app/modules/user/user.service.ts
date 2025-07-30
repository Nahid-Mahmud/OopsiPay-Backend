import { StatusCodes } from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { otpServices } from "../otp/otp.service";
import { hashPassword } from "./../../utils/hashPassword";
import { IUser } from "./user.interface";
import User from "./user.model";

const createUser = async (payload: Partial<IUser>) => {
  const { password, email } = payload;

  if (!password) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Password is required");
  }

  if (!email) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Email is required");
  }

  const hashedPassword = await hashPassword(password);

  const session = await User.startSession();

  // start a transaction
  session.startTransaction();

  try {
    const res = await User.create(
      [
        {
          ...payload,
          password: hashedPassword,
        },
      ],
      { session }
    );

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: userPassword, ...rest } = res[0].toObject();

    // commit the transaction first
    await session.commitTransaction();

    // send OTP after the transaction is committed
    await otpServices.sendOtp(email);

    return rest;
  } catch (error) {
    await session.abortTransaction();
    // throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, "User creation failed");
    throw error;
  } finally {
    session.endSession();
  }
};

export const userService = {
  createUser,
};
