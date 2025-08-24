import z from "zod";
import { IsActive, UserRole } from "./user.interface";

export const passwordZodValidationSchema = z
  .string()
  .min(8, { message: "Password must be at least 8 characters long" })
  .regex(/[A-Z]/, {
    message: "Password must contain at least one uppercase letter",
  })
  .regex(/[a-z]/, {
    message: "Password must contain at least one lowercase letter",
  })
  .regex(/[0-9]/, {
    message: "Password must contain at least one number",
  })
  .regex(/[^A-Za-z0-9]/, {
    message: "Password must contain at least one special character",
  });

export const userCreateZodSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.email("Invalid email format").min(1, "Email is required"),
  password: passwordZodValidationSchema,
  role: z.enum([UserRole.USER, UserRole.AGENT]).optional(),
});

export const updateUserZodSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.email("Invalid email format").optional(),
  role: z.enum(Object.values(UserRole)).optional(),
  profilePicture: z.string().optional(),
  deleteImages: z.array(z.string()).optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  // pin: z.string().min(5, "Pin must be at least 5 characters long").optional(),
  // pin must be exactly 5 characters long
  pin: z.string().length(5, "Pin must be exactly 5 characters long").optional(),
  isActive: z.enum(IsActive).optional(),
  isDeleted: z.boolean().optional(),
  isVerified: z.boolean().optional(),
});

export const changePinZodSchema = z.object({
  oldPin: z.string().min(5, "Old pin must be at least 5 characters long"),
  newPin: z.string().min(5, "New pin must be at least 5 characters long"),
});

export const setPinFirstTimeZodSchema = z.object({
  pin: z.string().length(5, "Pin must be exactly 5 characters long"),
});
