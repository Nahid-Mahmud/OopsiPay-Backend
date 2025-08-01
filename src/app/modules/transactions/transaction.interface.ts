import { Types } from "mongoose";

export enum TransactionType {
  CASH_IN = "CASH_IN",
  CASH_OUT = "CASH_OUT",
  SEND_MONEY = "SEND_MONEY",
  ADMIN_CREDIT = "ADMIN_CREDIT",
}

export enum TransactionStatus {
  PENDING = "PENDING",
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
}

export interface ITransaction {
  transactionType: TransactionType;
  transactionId: string;
  reference?: string;
  status: TransactionStatus;
  transactionAmount: number;
  transactionFee: number;
  netAmount: number;
  fromWallet: Types.ObjectId;
  toWallet: Types.ObjectId;
  fromUser: Types.ObjectId;
  toUser: Types.ObjectId;
}
