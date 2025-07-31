/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { walletService } from "./wallet.service";
import { JwtPayload } from "jsonwebtoken";
import sendResponse from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";

const updateWalletType = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { walletId } = req.params;

  // Validate walletId
  if (!walletId) {
    return next(new Error("Wallet ID is required"));
  }

  // Call the service to update the wallet type
  await walletService.updateWalletType(walletId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Wallet type updated successfully",
    data: null,
  });
});

const getMyWallet = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const decodedToken = req.user as JwtPayload;

  // Call the service to get the wallet balance
  const wallet = await walletService.getMyWallet(decodedToken.userId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Wallet balance retrieved successfully",
    data: wallet,
  });
});

const getAllWallets = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  // Call the service to get all wallets
  const wallets = await walletService.getAllWallets();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "All wallets retrieved successfully",
    data: wallets,
  });
});

export const walletController = {
  updateWalletType,
  getMyWallet,
  getAllWallets,
};
