import express from "express";
import * as bookingController from "../controllers/bookingController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { validationFields } from "../config/validationFields.js";

const router = express.Router();

// Public
router.get("/", bookingController.getBookings);
router.get("/:id", bookingController.getBooking);

// Protected
router.post(
  "/",
  authMiddleware,
  validateRequest(validationFields.bookingCreate),
  bookingController.createBooking
);

router.put(
  "/:id",
  authMiddleware,
  validateRequest(validationFields.bookingUpdate),
  bookingController.updateBooking
);

router.delete("/:id", authMiddleware, bookingController.deleteBooking);

export default router;
