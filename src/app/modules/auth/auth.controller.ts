import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { authService } from "./auth.service";
import { setAuthCookie } from "../../utils/setAuthCookie";
import { generateAuthTokens } from "../../utils/userTokens";
import { IUser } from "../user/user.interface";

const credentialLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = (await authService.credentialLogin(req, res, next)) as Partial<IUser>;

  const authTokens = generateAuthTokens(result as Partial<IUser>);

  setAuthCookie(res, {
    accessToken: authTokens.accessToken,
    refreshToken: authTokens.refreshToken,
  });

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "User logged in successfully",
    data: {
      ...result,
      accessToken: authTokens.accessToken,
      refreshToken: authTokens.refreshToken,
    },
  });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const generateAccessTokenFromRefreshToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const refreshToken = req.cookies.refreshToken;

  const response = await authService.generateAccessTokenFromRefreshToken(refreshToken);

  setAuthCookie(res, {
    accessToken: response,
  });

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Access token generated successfully",
    data: {
      accessToken: response,
    },
  });
});

export const authController = {
  credentialLogin,
  generateAccessTokenFromRefreshToken,
};
