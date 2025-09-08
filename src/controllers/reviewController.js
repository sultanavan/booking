import * as reviewService from "../services/reviewService.js";
import { Prisma } from "@prisma/client";
import logger from "../utils/logger.js";

export const getReviews = async (req, res, next) => {
  try {
    const reviews = await reviewService.findAllReviews();
    res.json(reviews);
  } catch (err) {
    logger.error(`Failed to fetch reviews: ${err.message}`);
    next(err);
  }
};

export const getReview = async (req, res, next) => {
  try {
    const review = await reviewService.findReviewById(req.params.id);
    if (!review) {
      logger.warn(`Review not found: ${req.params.id}`);
      return res.status(404).json({ message: "Review not found" });
    }
    res.json(review);
  } catch (err) {
    logger.error(`Failed to fetch review ${req.params.id}: ${err.message}`);
    next(err);
  }
};

export const createReview = async (req, res, next) => {
  try {
    const review = await reviewService.createReview(req.body);
    logger.info(`Review created: ${review.id}`);
    res.status(201).json(review);
  } catch (err) {
    logger.error(`Failed to create review: ${err.message}`);
    next(err);
  }
};

export const updateReview = async (req, res, next) => {
  try {
    const review = await reviewService.updateReview(req.params.id, req.body);
    logger.info(`Review updated: ${req.params.id}`);
    res.json(review);
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2025"
    ) {
      logger.warn(`Update failed, review not found: ${req.params.id}`);
      return res.status(404).json({ message: "Review not found" });
    }
    logger.error(`Failed to update review ${req.params.id}: ${err.message}`);
    next(err);
  }
};

export const deleteReview = async (req, res, next) => {
  try {
    await reviewService.deleteReview(req.params.id);
    logger.info(`Review deleted: ${req.params.id}`);
    res.json({ message: "Review deleted successfully" });
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2025"
    ) {
      logger.warn(`Delete failed, review not found: ${req.params.id}`);
      return res.status(404).json({ message: "Review not found" });
    }
    logger.error(`Failed to delete review ${req.params.id}: ${err.message}`);
    next(err);
  }
};
