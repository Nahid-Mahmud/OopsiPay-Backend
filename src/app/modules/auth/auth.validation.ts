import z from "zod";

export const userLoginJodValidation = z.object({
  email: z.email().min(1, "Email is required").max(100, "Email must be less than 100 characters"),
  password: z.string(),
});
