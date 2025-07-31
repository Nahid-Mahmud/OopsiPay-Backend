import z from "zod";
import { WalletType } from "./wallet.interface";

export const updateWalletTypeZodValidation = z.object({
  walletType: z.enum(Object.values(WalletType)).optional(),
});
