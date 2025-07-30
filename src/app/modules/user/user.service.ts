import { StatusCodes } from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { sendOtpEmail } from "../../utils/sendOtpEmail";
import { hashPassword } from "./../../utils/hashPassword";
import { IUser, UserRole } from "./user.interface";
import User from "./user.model";
import { JwtPayload } from "jsonwebtoken";

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
    const { password: userPassword, ...rest } = res[0].toObject();

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

  const updatedUser = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  }).select("-password");
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
  const user = await User.findById(userId).select(
    "-password -isActive -isVerified"
  );
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

export const userService = {
  createUser,
  updateUser,
  getAllUsers,
  getUserById,
  getMe,
};
