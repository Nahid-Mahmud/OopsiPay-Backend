/* eslint-disable @typescript-eslint/no-unused-vars */
import { Types } from "mongoose";
import { Wallet } from "../wallet/wallet.model";
import { calculateTransactionFee } from "../../utils/calculateTransactionFee";
import { Transaction } from "./transaction.model";
import crypto from "crypto";
import { TransactionStatus, TransactionType } from "./transaction.interface";
import AppError from "../../errorHelpers/AppError";
import { StatusCodes } from "http-status-codes";
import { WalletType } from "../wallet/wallet.interface";

const generateTransactionId = () => {
  return `txn_${crypto.randomBytes(8).toString("hex")}}`;
};

const createTransaction = async (
  toWalletNumber: string,
  amount: number,
  transactionType: string,
  userId: string,
  reference?: string
) => {
  const toWallet = await Wallet.findOne({
    walletNumber: toWalletNumber,
  }).populate("user", "_id");
  const fromWallet = await Wallet.findOne({
    user: userId,
  });

  if (!toWallet) {
    throw new AppError(StatusCodes.NOT_FOUND, "Destination Wallet not found");
  }

  if (!fromWallet) {
    throw new AppError(StatusCodes.NOT_FOUND, "Source Wallet not found");
  }

  const { transactionFee, netAmount, adminCredit, agentCredit } = calculateTransactionFee(amount, transactionType);

  const session = await Wallet.startSession();

  session.startTransaction();

  try {
    const transaction = await Transaction.create(
      [
        {
          transactionType: transactionType,
          transactionId: generateTransactionId(),
          reference: reference ? reference : "",
          status: TransactionStatus.SUCCESS,
          transactionAmount: amount,
          transactionFee: transactionFee,
          netAmount: amount + transactionFee,
          fromWallet: fromWallet._id,
          toWallet: toWallet._id,
          fromUser: userId,
          toUser: toWallet.user._id,
        },
      ],
      { session }
    );

    //  ideal send money

    if (transactionType === TransactionType.SEND_MONEY) {
      // for send money both wallets have to be user wallets

      if (fromWallet.walletType !== WalletType.USER || toWallet.walletType !== WalletType.USER) {
        throw new AppError(StatusCodes.BAD_REQUEST, "Both wallets must be user wallets");
      }

      // check if fromWallet has sufficient balance
      if (fromWallet.balance < amount + adminCredit) {
        throw new AppError(StatusCodes.BAD_REQUEST, "Insufficient balance");
      }

      const deductBalance = amount + transactionFee;

      const updateFromWallet = await Wallet.findByIdAndUpdate(
        fromWallet._id,
        {
          $inc: {
            balance: -deductBalance,
          },
        },
        {
          runValidators: true,
          session,
        }
      );

      const updateToWallet = await Wallet.findByIdAndUpdate(
        toWallet._id,
        {
          $inc: {
            balance: amount,
          },
        },
        {
          runValidators: true,
          session,
        }
      );

      const updateAdminWallet = await Wallet.findOneAndUpdate(
        {
          walletType: WalletType.ADMIN,
        },
        {
          $inc: {
            balance: adminCredit,
          },
        },
        {
          runValidators: true,
          session,
        }
      );
    }

    //  ideal cash In

    if (transactionType === TransactionType.CASH_IN) {
      if (fromWallet.walletType !== WalletType.USER || toWallet.walletType !== WalletType.MERCHANT) {
        throw new AppError(
          StatusCodes.BAD_REQUEST,
          "source wallet must be user wallet and destination wallet must be agent wallet"
        );
      }

      // check if fromWallet has sufficient balance
      if (fromWallet.balance < amount + adminCredit + agentCredit) {
        throw new AppError(StatusCodes.BAD_REQUEST, "Insufficient balance");
      }

      const deductBalance = amount + transactionFee;

      const updateFromWallet = await Wallet.findByIdAndUpdate(
        fromWallet._id,
        {
          $inc: {
            balance: -deductBalance,
          },
        },
        {
          runValidators: true,
          session,
        }
      );

      // update agent wallet
      const agentTotalAmount = amount + agentCredit;
      const updateToWallet = await Wallet.findByIdAndUpdate(
        toWallet._id,
        {
          $inc: {
            balance: agentTotalAmount,
          },
        },
        {
          runValidators: true,
          session,
        }
      );

      // update admin wallet
      const updateAdminWallet = await Wallet.findOneAndUpdate(
        {
          walletType: WalletType.ADMIN,
        },
        {
          $inc: {
            balance: adminCredit,
          },
        },
        {
          runValidators: true,
          session,
        }
      );
    }

    session.commitTransaction();
  } catch (error) {
    session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }

  // update
};

export const transactionService = {
  createTransaction,
};
