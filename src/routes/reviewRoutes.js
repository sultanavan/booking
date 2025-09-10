import express from "express";
import * as reviewController from "../controllers/reviewController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { validationFields } from "../config/validationFields.js";

const router = express.Router();

// Public
router.get("/", reviewController.getReviews);
router.get("/:id", reviewController.getReview);

// Protected
router.post(
  "/",
  authMiddleware,
  validateRequest(validationFields.reviewCreate),
  reviewController.createReview
);

router.put(
  "/:id",
  authMiddleware,
  validateRequest(validationFields.reviewUpdate),
  reviewController.updateReview
);

router.delete("/:id", authMiddleware, reviewController.deleteReview);

export default router;
