import * as bookingService from "../services/bookingService.js";
import { Prisma } from "@prisma/client";
import logger from "../utils/logger.js";

export const getBookings = async (req, res, next) => {
  try {
    const { userId } = req.query;

    if (userId) {
      const bookings = await bookingService.findBookingsByUserId(userId);
      if (!bookings.length)
        return res
          .status(404)
          .json({ message: "No bookings found for this user" });
      return res.json(bookings);
    }

    const bookings = await bookingService.findAllBookings();
    res.json(bookings);
  } catch (err) {
    logger.error(`Failed to fetch bookings: ${err.message}`);
    next(err);
  }
};

export const getBooking = async (req, res, next) => {
  try {
    const booking = await bookingService.findBookingById(req.params.id);
    if (!booking) {
      logger.warn(`Booking not found: ${req.params.id}`);
      return res.status(404).json({ message: "Booking not found" });
    }
    res.json(booking);
  } catch (err) {
    logger.error(`Failed to fetch booking ${req.params.id}: ${err.message}`);
    next(err);
  }
};

export const createBooking = async (req, res, next) => {
  try {
    const booking = await bookingService.createBooking(req.body);
    logger.info(`Booking created: ${booking.id}`);
    res.status(201).json(booking);
  } catch (err) {
    logger.error(`Failed to create booking: ${err.message}`);
    next(err);
  }
};

export const updateBooking = async (req, res, next) => {
  try {
    const booking = await bookingService.updateBooking(req.params.id, req.body);
    logger.info(`Booking updated: ${req.params.id}`);
    res.json(booking);
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2025"
    ) {
      logger.warn(`Update failed, booking not found: ${req.params.id}`);
      return res.status(404).json({ message: "Booking not found" });
    }
    logger.error(`Failed to update booking ${req.params.id}: ${err.message}`);
    next(err);
  }
};

export const deleteBooking = async (req, res, next) => {
  try {
    await bookingService.deleteBooking(req.params.id);
    logger.info(`Booking deleted: ${req.params.id}`);
    res.json({ message: "Booking deleted successfully" });
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2025"
    ) {
      logger.warn(`Delete failed, booking not found: ${req.params.id}`);
      return res.status(404).json({ message: "Booking not found" });
    }
    logger.error(`Failed to delete booking ${req.params.id}: ${err.message}`);
    next(err);
  }
};
