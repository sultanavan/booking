import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getBookings = async (req, res, next) => {
  try {
    const { userId } = req.query;
    const filters = {};
    if (userId) filters.userId = userId;

    const bookings = await prisma.booking.findMany({
      where: filters,
      include: { user: true, property: true },
    });
    res.status(200).json(bookings);
  } catch (err) {
    next(err);
  }
};

export const getBooking = async (req, res, next) => {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: req.params.id },
      include: { user: true, property: true },
    });
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.status(200).json(booking);
  } catch (err) {
    next(err);
  }
};

export const createBooking = async (req, res, next) => {
  try {
    const booking = await prisma.booking.create({ data: req.body });
    res.status(201).json(booking);
  } catch (err) {
    next(err);
  }
};

export const updateBooking = async (req, res, next) => {
  try {
    const booking = await prisma.booking.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.status(200).json(booking);
  } catch (err) {
    next(err);
  }
};

export const deleteBooking = async (req, res, next) => {
  try {
    await prisma.booking.delete({ where: { id: req.params.id } });
    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (err) {
    next(err);
  }
};
