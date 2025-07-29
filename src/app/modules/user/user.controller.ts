import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { IUser } from "./user.interface";
import sendResponse from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { userService } from "./user.service";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const payload = req.body as Partial<IUser>;
  const result = await userService.createUser(payload);

  sendResponse(res, {
    success: true,
    message: "User created successfully",
    data: result,
    statusCode: StatusCodes.CREATED,
  });
});

export const userController = {
  createUser,
};
