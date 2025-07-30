import crypto from "crypto";

const createWalletNumber = (): string => {
  const buffer = crypto.randomBytes(7); // 7 bytes ≈ 56 bits ≈ up to 14-digit decimal
  const number = parseInt(buffer.toString("hex"), 16) % 1e13;
  return number.toString().padStart(13, "0");
};
export default createWalletNumber;
