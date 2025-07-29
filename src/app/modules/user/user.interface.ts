import { Types } from "mongoose";

export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
  AGENT = "AGENT",
}

export enum IsActive {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BLOCKED = "BLOCKED",
}

export interface IUser {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
  isActive: IsActive;
  isDeleted: boolean;
  isVerified?: boolean;
  createdAt?: Date;
}
