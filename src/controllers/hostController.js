import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const getHosts = async (req, res, next) => {
  try {
    const { name } = req.query;
    const filters = {};
    if (name) filters.name = name;

    const hosts = await prisma.host.findMany({
      where: filters,
      include: { listings: true },
    });
    res.status(200).json(hosts);
  } catch (err) {
    next(err);
  }
};

export const getHost = async (req, res, next) => {
  try {
    const host = await prisma.host.findUnique({
      where: { id: req.params.id },
      include: { listings: true },
    });
    if (!host) return res.status(404).json({ message: "Host not found" });
    res.status(200).json(host);
  } catch (err) {
    next(err);
  }
};

export const createHost = async (req, res, next) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const host = await prisma.host.create({
      data: { ...req.body, password: hashedPassword },
    });
    res.status(201).json(host);
  } catch (err) {
    next(err);
  }
};

export const updateHost = async (req, res, next) => {
  try {
    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 10);
    }
    const host = await prisma.host.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.status(200).json(host);
  } catch (err) {
    next(err);
  }
};

export const deleteHost = async (req, res, next) => {
  try {
    await prisma.host.delete({ where: { id: req.params.id } });
    res.status(200).json({ message: "Host deleted successfully" });
  } catch (err) {
    next(err);
  }
};
