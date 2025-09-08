import express from "express";
import * as propertyController from "../controllers/propertyController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", propertyController.getProperties);
router.get("/:id", propertyController.getProperty);
router.post("/", authMiddleware, propertyController.createProperty);
router.put("/:id", authMiddleware, propertyController.updateProperty);
router.delete("/:id", authMiddleware, propertyController.deleteProperty);

export default router;
