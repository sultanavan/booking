import express from "express";
import * as authController from "../controllers/authController.js";

const router = express.Router();

// Public
router.post("/", authController.login);

export default router;
