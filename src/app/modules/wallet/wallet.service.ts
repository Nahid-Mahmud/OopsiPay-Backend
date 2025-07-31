import { StatusCodes } from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { IUser, UserRole } from "../user/user.interface";
import { WalletType } from "./wallet.interface";
import { Wallet } from "./wallet.model";
import User from "../user/user.model";

const updateWalletType = async (walletId: string) => {
  // check if walletId is valid
  const wallet = await Wallet.findById(walletId).populate("user");

  //   return;

  if (!wallet) {
    throw new Error("Wallet not found");
  }

  //   check if the wallet is already merchant wallet and user is is agent

  if (wallet.walletType === WalletType.MERCHANT && (wallet.user as unknown as IUser).role === UserRole.AGENT) {
    throw new AppError(StatusCodes.BAD_REQUEST, "This is Already a Merchant Wallet");
  }

  const session = await Wallet.startSession();
  session.startTransaction();

  try {
    await Wallet.findByIdAndUpdate(
      walletId,
      {
        walletType: WalletType.MERCHANT,
      },
      {
        new: true,
        runValidators: true,
        session,
      }
    );

    await User.findByIdAndUpdate(
      (wallet.user as unknown as IUser)._id,
      {
        role: UserRole.AGENT,
      },
      {
        new: true,
        runValidators: true,
        session,
      }
    );

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

const getMyWallet = async (userId: string) => {
  // check if userId is valid
  const wallet = await Wallet.findOne({ user: userId }).select("-user");

  if (!wallet) {
    throw new AppError(StatusCodes.NOT_FOUND, "Wallet not found");
  }

  return wallet;
};

const getAllWallets = async () => {
  // Call the Wallet model to get all wallets
  const wallets = await Wallet.find().populate("user", "-password -pin");
  return wallets;
};

const getWalletByUserId = async (userId: string) => {
  // check if userId is valid
  const wallet = await Wallet.findOne({ user: userId }).populate("user", "-password -pin");

  if (!wallet) {
    throw new AppError(StatusCodes.NOT_FOUND, "Wallet not found");
  }

  return wallet;
};

export const walletService = {
  updateWalletType,
  getMyWallet,
  getAllWallets,
  getWalletByUserId,
};
