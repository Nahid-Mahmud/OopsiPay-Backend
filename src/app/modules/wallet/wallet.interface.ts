import { Types } from "mongoose";

export enum WalletType {
  ADMIN = "ADMIN",
  USER = "USER",
  MERCHANT = "MERCHANT",
}

export enum WalletStatus {
  ACTIVE = "ACTIVE",
  SUSPENDED = "SUSPENDED",
}

export interface IWallet {
  walletNumber: string;
  balance: number;
  user: Types.ObjectId;
  walletType: WalletType;
  walletStatus: WalletStatus;
}
