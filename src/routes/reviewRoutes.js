import express from "express";
import * as reviewController from "../controllers/reviewController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", reviewController.getReviews);
router.get("/:id", reviewController.getReview);
router.post("/", authMiddleware, reviewController.createReview);
router.put("/:id", authMiddleware, reviewController.updateReview);
router.delete("/:id", authMiddleware, reviewController.deleteReview);

export default router;
