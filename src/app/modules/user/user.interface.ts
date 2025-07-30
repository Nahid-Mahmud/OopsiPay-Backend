import { Types } from "mongoose";

export enum UserRole {
  USER = "USER",
  AGENT = "AGENT",
  ADMIN = "ADMIN",
  SUPER_ADMIN = "SUPER_ADMIN",
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
  profilePicture?: string;
  password: string;
  role: UserRole;
  isActive: IsActive;
  isDeleted: boolean;
  isVerified?: boolean;
  createdAt?: Date;
  pin?: string;
  phone: string;
  address?: string;
} 
