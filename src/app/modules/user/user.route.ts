import { Router } from "express";
import { userController } from "./user.controller";

import { multerUpload } from "../../config/multer.config";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { UserRole } from "./user.interface";
import {
  changePinZodSchema,
  setPinFirstTimeZodSchema,
  updateUserZodSchema,
  userCreateZodSchema,
} from "./user.validation";

const router = Router();

// create user
router.post("/create", validateRequest(userCreateZodSchema), userController.createUser);

router.patch(
  "/set-pin",
  validateRequest(setPinFirstTimeZodSchema),
  checkAuth(...Object.values(UserRole)),
  userController.setPinFirstTime
);

// get All Users
router.get("/get-all", checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN), userController.getAllUsers);

// get me route
router.get("/me", checkAuth(...Object.values(UserRole)), userController.getMe);
router.patch(
  "/change-pin",
  validateRequest(changePinZodSchema),
  checkAuth(...Object.values(UserRole)),
  userController.changePin
);
// update user
router.patch(
  "/:userId",
  checkAuth(...Object.values(UserRole)),
  multerUpload.single("file"),
  validateRequest(updateUserZodSchema),
  userController.updateUser
);

// get user by userID

router.get("/:userId", checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN), userController.getUserById);

export const userRoutes = router;
