import { model, Schema } from "mongoose";
import { IWallet, WalletStatus, WalletType } from "./wallet.interface";

const walletSchema = new Schema<IWallet>(
  {
    balance: { type: Number, required: true, min: 0 },
    walletNumber: { type: String, required: true, unique: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    walletType: { type: String, enum: Object.values(WalletType), required: true },
    walletStatus: { type: String, enum: Object.values(WalletStatus), required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Wallet = model<IWallet>("Wallet", walletSchema);
