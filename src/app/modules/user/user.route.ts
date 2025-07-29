import { Router } from "express";
import { userController } from "./user.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { userCreateZodSchema } from "./user.validation";

const router = Router();

router.post("/create", validateRequest(userCreateZodSchema), userController.createUser);

export const userRoutes = router;
