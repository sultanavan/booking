import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function findAllUsers() {
  return prisma.user.findMany({
    include: { reviews: true, bookings: true },
  });
}

export async function findUserById(id) {
  return prisma.user.findUnique({
    where: { id },
    include: { reviews: true, bookings: true },
  });
}

export async function findUserByUsername(username) {
  return prisma.user.findUnique({
    where: { username },
    include: { reviews: true, bookings: true },
  });
}

export async function findUserByEmail(email) {
  return prisma.user.findUnique({
    where: { email },
    include: { reviews: true, bookings: true },
  });
}

export async function createUser(data) {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  return prisma.user.create({
    data: { ...data, password: hashedPassword },
  });
}

export async function updateUser(id, data) {
  return prisma.user.update({
    where: { id },
    data,
  });
}

export async function deleteUser(id) {
  return prisma.user.delete({
    where: { id },
  });
}
