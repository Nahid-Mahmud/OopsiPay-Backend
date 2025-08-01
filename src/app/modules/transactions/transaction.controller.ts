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

  const response = await transactionService.createTransaction(walletNumber, amount, transactionType, userId, reference);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: response,
    data: null,
  });
});

const getTransactionById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { transactionId } = req.params;

  if (!transactionId) {
    return next(new Error("Transaction ID is required"));
  }

  const transaction: ITransaction = await transactionService.getTransactionById(transactionId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Transaction retrieved successfully",
    data: transaction,
  });
});

const getAllTransactions = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const transactions = await transactionService.getAllTransactions();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Transactions retrieved successfully",
    data: transactions,
  });
});

const getMyTransactions = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as JwtPayload;
  const userId = user.userId;

  const transactions = await transactionService.getMyTransactions(userId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "My transactions retrieved successfully",
    data: transactions,
  });
});

export const transactionController = {
  createTransaction,
  getTransactionById,
  getAllTransactions,
  getMyTransactions,
};
