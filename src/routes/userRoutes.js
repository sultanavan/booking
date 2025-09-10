import express from "express";
import * as userController from "../controllers/userController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { validationFields } from "../config/validationFields.js";

const router = express.Router();

// Public
router.get("/", userController.getUsers);
router.get("/:id", userController.getUser);

// Protected
router.post(
  "/",
  authMiddleware,
  validateRequest(validationFields.userCreate),
  userController.createUser
);

router.put(
  "/:id",
  authMiddleware,
  validateRequest(validationFields.userUpdate),
  userController.updateUser
);

router.delete("/:id", authMiddleware, userController.deleteUser);

export default router;
