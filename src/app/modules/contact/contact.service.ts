import { IContact } from "./contact.interface";
import { Contact } from "./contact.model";

const createContact = async (data: IContact) => {
  const res = await Contact.create(data);
  return res;
};

const getAllContacts = async () => {
  const res = await Contact.find();
  return res;
};

const getContactById = async (id: string) => {
  const res = await Contact.findById(id);
  return res;
};

const updateContact = async (id: string, data: Partial<IContact>) => {
  const res = await Contact.findByIdAndUpdate(id, data, { new: true });
  return res;
};

const deleteContact = async (id: string) => {
  const res = await Contact.findByIdAndDelete(id);
  return res;
};

export const contactService = {
  createContact,
  getAllContacts,
  getContactById,
  updateContact,
  deleteContact,
};
