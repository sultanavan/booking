import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function findAllBookings() {
  return prisma.booking.findMany({ include: { user: true, property: true } });
}

export async function findBookingById(id) {
  return prisma.booking.findUnique({
    where: { id },
    include: { user: true, property: true },
  });
}

export const findBookingsByUserId = async (userId) => {
  return prisma.booking.findMany({
    where: { userId },
    include: { property: true }, // include property info if useful
  });
};

export async function createBooking(data) {
  return prisma.booking.create({
    data,
    include: { user: true, property: true },
  });
}

export async function updateBooking(id, data) {
  return prisma.booking.update({
    where: { id },
    data,
    include: { user: true, property: true },
  });
}

export async function deleteBooking(id) {
  return prisma.booking.delete({ where: { id } });
}
