import * as userService from "../services/userService.js";
import { Prisma } from "@prisma/client";
import logger from "../utils/logger.js";

export const getUsers = async (req, res, next) => {
  try {
    const { username, email } = req.query;

    if (username) {
      const user = await userService.findUserByUsername(username);
      if (!user) return res.status(404).json({ message: "User not found" });
      return res.json(user);
    }

    if (email) {
      const user = await userService.findUserByEmail(email);
      if (!user) return res.status(404).json({ message: "User not found" });
      return res.json(user);
    }

    const users = await userService.findAllUsers();
    res.json(users);
  } catch (err) {
    logger.error(`Failed to fetch users: ${err.message}`);
    next(err);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await userService.findUserById(req.params.id);
    if (!user) {
      logger.warn(`User not found: ${req.params.id}`);
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    logger.error(`Failed to fetch user ${req.params.id}: ${err.message}`);
    next(err);
  }
};

export const createUser = async (req, res, next) => {
  try {
    const user = await userService.createUser(req.body);
    logger.info(`User created: ${user.id}`);
    res.status(201).json(user);
  } catch (err) {
    logger.error(`Failed to create user: ${err.message}`);
    next(err);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    logger.info(`User updated: ${req.params.id}`);
    res.json(user);
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2025"
    ) {
      logger.warn(`Update failed, user not found: ${req.params.id}`);
      return res.status(404).json({ message: "User not found" });
    }
    logger.error(`Failed to update user ${req.params.id}: ${err.message}`);
    next(err);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    await userService.deleteUser(req.params.id);
    logger.info(`User deleted: ${req.params.id}`);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2025"
    ) {
      logger.warn(`Delete failed, user not found: ${req.params.id}`);
      return res.status(404).json({ message: "User not found" });
    }
    logger.error(`Failed to delete user ${req.params.id}: ${err.message}`);
    next(err);
  }
};
