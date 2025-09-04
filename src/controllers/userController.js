import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// GET all users or filter by username/email
export const getUsers = async (req, res, next) => {
  try {
    const { username, email } = req.query;
    const filters = {};
    if (username) filters.username = username;
    if (email) filters.email = email;

    const users = await prisma.user.findMany({
      where: filters,
      include: { bookings: true, reviews: true },
    });

    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};

// GET one user by id
export const getUser = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      include: { bookings: true, reviews: true },
    });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

// POST create user
export const createUser = async (req, res, next) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = await prisma.user.create({
      data: { ...req.body, password: hashedPassword },
    });
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
};

// PUT update user
export const updateUser = async (req, res, next) => {
  try {
    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 10);
    }
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

// DELETE user
export const deleteUser = async (req, res, next) => {
  try {
    await prisma.user.delete({ where: { id: req.params.id } });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    next(err);
  }
};
