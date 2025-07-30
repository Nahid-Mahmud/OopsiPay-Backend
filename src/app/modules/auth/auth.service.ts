import bcryptjs from "bcryptjs";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import passport from "passport";
import AppError from "../../errorHelpers/AppError";
import { createNewRefreshToken } from "../../utils/userTokens";
import User from "../user/user.model";
import { JwtPayload } from "jsonwebtoken";
import envVariables from "../../config/env";

const credentialLogin = async (req: Request, res: Response, next: NextFunction) => {
  return new Promise((resolve, reject) => {
    passport.authenticate("local", async (error: any, user: any, info: any) => {
      if (error) {
        return reject(new AppError(StatusCodes.INTERNAL_SERVER_ERROR, error.message));
      }

      if (!user) {
        return reject(new AppError(StatusCodes.UNAUTHORIZED, info.message || "Invalid credentials"));
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userWithoutPassword } = user.toObject();
      resolve(userWithoutPassword);
    })(req, res, next);
  });
};

const generateAccessTokenFromRefreshToken = async (refreshToken: string) => {
  const newAccessToken = await createNewRefreshToken(refreshToken);
  return newAccessToken;
};

const resetPassword = async (newPassword: string, id: string, decodedToken: JwtPayload) => {
  if (decodedToken.userId !== id) {
    throw new AppError(StatusCodes.UNAUTHORIZED, "You are not authorized to perform this action");
  }

  const isUserExist = await User.findById(decodedToken.userId);

  if (!isUserExist) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }

  const hashedNewPassword = await bcryptjs.hash(newPassword, Number(envVariables.BCRYPT_SALT_ROUNDS));

  isUserExist.password = hashedNewPassword;
  await isUserExist.save();
};

export const authService = {
  credentialLogin,
  generateAccessTokenFromRefreshToken,
  resetPassword,
};
