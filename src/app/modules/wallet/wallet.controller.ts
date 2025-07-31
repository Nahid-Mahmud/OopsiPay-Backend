import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { walletService } from "./wallet.service";

const updateWalletType = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { walletId } = req.params;

  // Validate walletId
  if (!walletId) {
    return next(new Error("Wallet ID is required"));
  }

  // Call the service to update the wallet type
  await walletService.updateWalletType(walletId);

  res.status(200).json({
    status: "success",
    message: "Wallet type updated successfully",
  });
});

export const walletController = {
  updateWalletType,
};
