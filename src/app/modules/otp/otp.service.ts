import { StatusCodes } from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import verifyOtp from "../../utils/verifyOtp";
import User from "../user/user.model";
import { Wallet } from "../wallet/wallet.model";
import createWalletNumber from "../../utils/createWalletNumber";
import { WalletStatus, WalletType } from "../wallet/wallet.interface";
import { UserRole } from "../user/user.interface";

const verifyOtpUser = async (email: string, otp: string) => {
  const session = await User.startSession();
  session.startTransaction();
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError(StatusCodes.NOT_FOUND, "User not found");
    }
    if (user.isVerified) {
      throw new AppError(StatusCodes.BAD_REQUEST, "User is already verified");
    }
    await verifyOtp(email, otp);
    await User.updateOne({ email }, { isVerified: true }, { runValidators: true, session });

    await Wallet.create(
      [
        {
          user: user._id,
          walletNumber: createWalletNumber(),
          balance: 50000,
          walletType: user.role === UserRole.USER ? WalletType.USER : WalletType.MERCHANT,
          walletStatus: WalletStatus.ACTIVE,
        },
      ],
      { session }
    );

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const otpServices = {
  verifyOtpUser,
};
