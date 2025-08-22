import z from "zod";
import { ContactStatus } from "./contact.interface";
export const createContactValidationSchema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters long" }).max(100).nonempty().trim(),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters long" }).max(100).nonempty().trim(),
  email: z
    .email({
      message: "Invalid email address",
    })
    .nonempty()
    .trim(),
  subject: z.string().min(2, { message: "Subject must be at least 2 characters long" }).max(100).nonempty().trim(),
  message: z.string().min(2, { message: "Message must be at least 2 characters long" }).max(1000).nonempty().trim(),
});

export const updateContactValidationSchema = z.object({
  status: z.enum(ContactStatus),
});
