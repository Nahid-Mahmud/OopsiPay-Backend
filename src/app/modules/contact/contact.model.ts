import { model, Schema } from "mongoose";
import { ContactStatus, IContact } from "./contact.interface";

const contactSchema = new Schema<IContact>(
  {
    email: { type: String, required: true, trim: true, lowercase: true },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    status: { type: String, enum: ContactStatus, default: ContactStatus.PENDING },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export const Contact = model<IContact>("Contact", contactSchema);
