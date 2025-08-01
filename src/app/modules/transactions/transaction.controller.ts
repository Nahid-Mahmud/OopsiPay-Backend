/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { ITransaction } from "./transaction.interface";
import { transactionService } from "./transaction.service";
import { IWallet } from "../wallet/wallet.interface";
import { JwtPayload } from "jsonwebtoken";

const createTransaction = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { walletNumber, amount, transactionType, reference } = req.body;

  const user = req.user as JwtPayload;

  const userId = user.userId;

  if (!walletNumber || !amount || !transactionType) {
    return next(new Error("All fields are required"));
  }

  await transactionService.createTransaction(walletNumber, amount, transactionType, userId, reference);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Transaction created successfully",
    data: null,
  });
});

export const transactionController = {
  createTransaction,
};
