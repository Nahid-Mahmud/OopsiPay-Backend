import z from "zod";
import { TransactionType } from "./transaction.interface";

export const createTransactionZodSchema = z.object({
  walletNumber: z.string().min(1, "Wallet number is required"),
  amount: z.number().min(50, "Amount must be at least 50"),
  transactionType: z.enum(TransactionType, "Invalid transaction type"),
  reference: z.string().optional(),
  pin: z.string().min(5, "PIN must be at least 5 characters long"),
});
