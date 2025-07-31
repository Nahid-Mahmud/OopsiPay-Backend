import { Router } from "express";
import { userController } from "./user.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { updateUserZodSchema, userCreateZodSchema } from "./user.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { UserRole } from "./user.interface";
import { multerUpload } from "../../config/multer.config";

const router = Router();

// create user
router.post("/create", validateRequest(userCreateZodSchema), userController.createUser);

// update user
router.patch(
  "/:userId",
  checkAuth(...Object.values(UserRole)),
  multerUpload.single("file"),
  validateRequest(updateUserZodSchema),
  userController.updateUser
);

// get All Users
router.get("/get-all", checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN), userController.getAllUsers);

// get me route
router.get("/me", checkAuth(...Object.values(UserRole)), userController.getMe);
router.post("/change-pin", checkAuth(...Object.values(UserRole)), userController.changePin);

// get user by userID

router.get("/:userId", checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN), userController.getUserById);

export const userRoutes = router;
