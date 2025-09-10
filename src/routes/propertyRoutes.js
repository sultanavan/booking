import express from "express";
import * as propertyController from "../controllers/propertyController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { validationFields } from "../config/validationFields.js";

const router = express.Router();

// Public
router.get("/", propertyController.getProperties);
router.get("/:id", propertyController.getProperty);

// Protected
router.post(
  "/",
  authMiddleware,
  validateRequest(validationFields.propertyCreate),
  propertyController.createProperty
);

router.put(
  "/:id",
  authMiddleware,
  validateRequest(validationFields.propertyUpdate),
  propertyController.updateProperty
);

router.delete("/:id", authMiddleware, propertyController.deleteProperty);

export default router;
