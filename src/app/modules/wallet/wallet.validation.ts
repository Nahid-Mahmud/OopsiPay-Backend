import z from "zod";
import { WalletStatus, WalletType } from "./wallet.interface";

export const updateWalletZodValidation = z.object({
  balance: z.number().min(0).optional(),
  walletType: z.enum(Object.values(WalletType)).optional(),
  walletStatus: z.enum(Object.values(WalletStatus)).optional(),
});
