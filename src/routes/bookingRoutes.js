import express from "express";
import * as bookingController from "../controllers/bookingController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", bookingController.getBookings);
router.get("/:id", bookingController.getBooking);
router.post("/", authMiddleware, bookingController.createBooking);
router.put("/:id", authMiddleware, bookingController.updateBooking);
router.delete("/:id", authMiddleware, bookingController.deleteBooking);

export default router;
