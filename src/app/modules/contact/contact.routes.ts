import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { contactController } from "./contact.controller";
import { createContactValidationSchema, updateContactValidationSchema } from "./contact.validation";

const router = Router();

router.post("/", validateRequest(createContactValidationSchema), contactController.createContact);
router.get("/", contactController.getAllContacts);
router.get("/:id", contactController.getContactById);
router.put("/:id", validateRequest(updateContactValidationSchema), contactController.updateContact);
router.delete("/:id", contactController.deleteContact);

export const contactRoutes = router;
