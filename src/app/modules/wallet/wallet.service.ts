import { StatusCodes } from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { QueryBuilder } from "../../utils/queryBuilder";
import { IUser, UserRole } from "../user/user.interface";
import User from "../user/user.model";
import { WalletType } from "./wallet.interface";
import { Wallet } from "./wallet.model";

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

const getAllWallets = async (query: Record<string, string>) => {
  // Call the Wallet model to get all wallets

  const queryBuilder = new QueryBuilder(Wallet.find(), query);

  // const wallets = await Wallet.find().populate("user", "-password -pin");
  const wallets = await queryBuilder.paginate().search(["walletNumber"]).build().populate("user", "-password -pin");
  const meta = await queryBuilder.getMeta();

  return { wallets, meta };
};

const getWalletByUserId = async (userId: string) => {
  // check if userId is valid
  const wallet = await Wallet.findOne({ user: userId }).populate("user", "-password -pin");

  if (!wallet) {
    throw new AppError(StatusCodes.NOT_FOUND, "Wallet not found");
  }

  return wallet;
};

const updateWalletStatus = async (walletId: string, walletStatus: string) => {
  if (!walletStatus) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Wallet status is required");
  }

  if (!walletStatus) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Wallet status is required");
  }

  // check if walletId is valid
  const wallet = await Wallet.findById(walletId);

  if (!wallet) {
    throw new AppError(StatusCodes.NOT_FOUND, "Wallet not found");
  }

  // Cast walletStatus to WalletStatus enum

  const updatedWallet = await Wallet.findByIdAndUpdate(
    walletId,
    {
      walletStatus: walletStatus,
    },
    {
      runValidators: true,
      new: true,
    }
  );

  return updatedWallet;
};

export const walletService = {
  updateWalletType,
  getMyWallet,
  getAllWallets,
  getWalletByUserId,
  updateWalletStatus,
};
