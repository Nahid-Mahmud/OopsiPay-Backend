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

export enum AgentRequestStatus {
  NONE = "NONE",
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export interface IUser {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  profilePicture?: string;
  password: string;
  createdAt?: Date;
  pin?: string;
  phone: string;
  address?: string;
  role: UserRole;
  isActive: IsActive;
  isDeleted: boolean;
  isVerified?: boolean;
  agentRequestStatus?: AgentRequestStatus;
  deleteImages?: string[];
}
