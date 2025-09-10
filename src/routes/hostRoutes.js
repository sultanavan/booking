import express from "express";
import * as hostController from "../controllers/hostController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { validationFields } from "../config/validationFields.js";

const router = express.Router();

// Public
router.get("/", hostController.getHosts);
router.get("/:id", hostController.getHost);

// Protected
router.post(
  "/",
  authMiddleware,
  validateRequest(validationFields.hostCreate),
  hostController.createHost
);

router.put(
  "/:id",
  authMiddleware,
  validateRequest(validationFields.hostUpdate),
  hostController.updateHost
);

router.delete("/:id", authMiddleware, hostController.deleteHost);

export default router;
