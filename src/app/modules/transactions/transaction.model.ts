import { model, Schema } from "mongoose";
import { ITransaction, TransactionStatus, TransactionType } from "./transaction.interface";
const TransactionSchema = new Schema<ITransaction>(
  {
    transactionType: {
      type: String,
      enum: Object.values(TransactionType),
      required: true,
    },
    transactionId: {
      type: String,
      required: true,
    },
    reference: {
      type: String,
    },
    status: {
      type: String,
      enum: Object.values(TransactionStatus),
      required: true,
    },
    transactionAmount: {
      type: Number,
      required: true,
    },
    transactionFee: {
      type: Number,
    },
    netAmount: {
      type: Number,
    },
    fromWallet: {
      type: Schema.Types.ObjectId,
      ref: "Wallet",
      required: true,
    },
    toWallet: {
      type: Schema.Types.ObjectId,
      ref: "Wallet",
      required: true,
    },
    fromUser: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    toUser: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Transaction = model<ITransaction>("Transaction", TransactionSchema);
