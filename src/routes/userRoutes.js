import express from "express";
import * as userController from "../controllers/userController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public GET routes
router.get("/", userController.getUsers);
router.get("/:id", userController.getUser);

// Protected routes
router.post("/", authMiddleware, userController.createUser);
router.put("/:id", authMiddleware, userController.updateUser);
router.delete("/:id", authMiddleware, userController.deleteUser);

export default router;
