/* eslint-disable no-console */
import envVariables from "../config/env";
import { IUser, UserRole } from "../modules/user/user.interface";
import User from "../modules/user/user.model";
import { WalletStatus, WalletType } from "../modules/wallet/wallet.interface";
import { Wallet } from "../modules/wallet/wallet.model";
import createWalletNumber from "./createWalletNumber";
import { hashPassword } from "./hashPassword";

export const seedSuperAdmin = async () => {
  try {
    // console.log("object");

    // check if super admin already exists
    const existingSuperAdmin = await User.findOne({ email: envVariables.ADMIN.SUPER_ADMIN_EMAIL });

    if (existingSuperAdmin) {
      console.log("Super admin already exists.");
      return;
    }

    const password = await hashPassword(envVariables.ADMIN.SUPER_ADMIN_PASSWORD);

    const payload: Partial<IUser> = {
      firstName: "Admin",
      lastName: "Admin",
      email: envVariables.ADMIN.SUPER_ADMIN_EMAIL,
      role: UserRole.SUPER_ADMIN,
      password,
      isVerified: true,
      pin: envVariables.ADMIN.SUPER_ADMIN_PIN,
      address: envVariables.ADMIN.SUPER_ADMIN_ADDRESS,
    };

    const session = await User.startSession();
    session.startTransaction();
    try {
      const user = await User.create([payload], { session });

      await Wallet.create(
        [
          {
            user: user[0]._id,
            walletNumber: createWalletNumber(),
            balance: 0,
            walletType: WalletType.ADMIN,
            walletStatus: WalletStatus.ACTIVE,
          },
        ],
        { session }
      );

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }

    console.log("Super admin seeded successfully.");
  } catch (error) {
    console.error("Error seeding super admin:", error);
  }
};
