import z from "zod";
import { WalletStatus, WalletType } from "./wallet.interface";

export const updateWalletTypeZodValidation = z.object({
  walletType: z.enum(Object.values(WalletType)).optional(),
});

export const updateWalletStatusZodValidation = z.object({
  walletStatus: z.enum(Object.values(WalletStatus)).optional(),
});
