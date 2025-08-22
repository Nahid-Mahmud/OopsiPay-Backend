import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { contactService } from "./contact.service";
import sendResponse from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const createContact = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
  const contactData = req.body;
  await contactService.createContact(contactData);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    data: null,
    message: "Contact created successfully",
  });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getAllContacts = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
  const contacts = await contactService.getAllContacts();

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    data: contacts,
    message: "Contacts retrieved successfully",
  });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getContactById = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
  const { id } = req.params;
  const contact = await contactService.getContactById(id);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    data: contact,
    message: "Contact retrieved successfully",
  });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const updateContact = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
  const { id } = req.params;
  const contactData = req.body;
  const updatedContact = await contactService.updateContact(id, contactData);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    data: updatedContact,
    message: "Contact updated successfully",
  });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const deleteContact = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
  const { id } = req.params;
  await contactService.deleteContact(id);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.NO_CONTENT,
    message: "Contact deleted successfully",
    data: null,
  });
});

export const contactController = {
  createContact,
  getAllContacts,
  getContactById,
  updateContact,
  deleteContact,
};
