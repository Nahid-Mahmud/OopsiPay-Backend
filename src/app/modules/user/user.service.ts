import { hashPassword } from "./../../utils/hashPassword";
import { IUser } from "./user.interface";
import User from "./user.model";

const createUser = async (payload: Partial<IUser>) => {
  const { password } = payload;

  if (!password) {
    throw new Error("Password is required");
  }

  const hashedPassword = await hashPassword(password);

  const res = await User.create({
    ...payload,
    password: hashedPassword,
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: userPassword, ...rest } = res.toObject();

  return rest;
};

export const userService = {
  createUser,
};
