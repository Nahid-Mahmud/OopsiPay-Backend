/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { statsService } from "./stats.service";
import sendResponse from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";

const getUserStats = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const response = await statsService.getUserStats();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "User statistics retrieved successfully",
    data: response,
  });
});

const transactionType = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const response = await statsService.getTransactionStats();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Transaction statistics retrieved successfully",
    data: response,
  });
});

export const statsController = {
  getUserStats,
  transactionType,
};
