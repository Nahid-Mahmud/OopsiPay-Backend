import bcrypt from "bcryptjs";
import { StatusCodes } from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import envVariables from "../../config/env";
import AppError from "../../errorHelpers/AppError";
import { sendOtpEmail } from "../../utils/sendOtpEmail";
import { hashPassword } from "./../../utils/hashPassword";
import { IUser, UserRole } from "./user.interface";
import User from "./user.model";

// create user
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
    const { password: userPassword, pin: userPin, ...rest } = res[0].toObject();

    // create wallet number

    // commit the transaction first
    await session.commitTransaction();

    // send OTP after the transaction is committed
    await sendOtpEmail({
      email,
      expirationTimeInSeconds: 300, // 5 minutes
    });

    return rest;
  } catch (error) {
    await session.abortTransaction();
    // throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, "User creation failed");
    throw error;
  } finally {
    session.endSession();
  }
};

// update user

const updateUser = async (userId: string, payload: Partial<IUser>, decodedToken: JwtPayload) => {
  if (decodedToken.role === UserRole.USER || decodedToken.role === UserRole.AGENT) {
    if (userId !== decodedToken.userId) {
      throw new AppError(StatusCodes.FORBIDDEN, "You do not have permission to update this user");
    }
  }

  // check if user exists

  const user = await User.findById(decodedToken.userId);

  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }

  // role update validation

  if (decodedToken.role === UserRole.ADMIN && user.role === UserRole.SUPER_ADMIN) {
    throw new AppError(StatusCodes.FORBIDDEN, "You do not have permission to update this user");
  }

  if (payload.role) {
    if (decodedToken.role === UserRole.USER || decodedToken.role === UserRole.AGENT) {
      throw new AppError(StatusCodes.FORBIDDEN, "You do not have permission to change user role");
    }
  }

  // isActive, isDeleted, isVerified update validation
  if (payload.isActive || payload.isDeleted || payload.isVerified) {
    if (decodedToken.role === UserRole.USER || decodedToken.role === UserRole.AGENT) {
      throw new AppError(StatusCodes.FORBIDDEN, "You do not have permission to change user status");
    }
  }

  if (payload.pin && (user.role === UserRole.USER || user.role === UserRole.AGENT)) {
    // check if pin has already been set
    if (user.pin) {
      throw new AppError(StatusCodes.BAD_REQUEST, "Pin has already been set. Use change pin to update it");
    }
  }

  if (payload.pin) {
    payload.pin = await bcrypt.hash(payload.pin, Number(envVariables.BCRYPT_SALT_ROUNDS));
  }

  const updatedUser = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  }).select("-password -pin");
  return updatedUser;
};

// get all users
const getAllUsers = async () => {
  const users = await User.find({}).select("-password");
  const totalUsers = await User.countDocuments();
  return { data: users, meta: totalUsers };
};

// get logged-in user
const getMe = async (userId: string) => {
  const user = await User.findById(userId).select("-password -isActive -isVerified");
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }
  return user;
};

// get user by userID
const getUserById = async (userId: string) => {
  const user = await User.findById(userId).select("-password");
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }
  return user;
};

// change pin
const changePin = async (userId: string, oldPin: string, newPin: string) => {
  // check if user exists
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }

  if (!user.pin) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User does not have a pin set");
  }

  // verify old pin
  const isPinValid = await bcrypt.compare(oldPin, user.pin);

  if (!isPinValid) {
    throw new AppError(StatusCodes.UNAUTHORIZED, "Old pin is incorrect");
  }

  const newHashedPin = await bcrypt.hash(newPin, Number(envVariables.BCRYPT_SALT_ROUNDS));

  // update pin
  await User.findByIdAndUpdate(
    userId,
    { pin: newHashedPin },
    {
      new: true,
      runValidators: true,
    }
  );
};

export const userService = {
  createUser,
  updateUser,
  getAllUsers,
  getUserById,
  getMe,
  changePin,
};
