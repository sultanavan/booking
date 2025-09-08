import * as hostService from "../services/hostService.js";
import { Prisma } from "@prisma/client";
import logger from "../utils/logger.js";

export const getHosts = async (req, res, next) => {
  try {
    const hosts = await hostService.findAllHosts();
    res.json(hosts);
  } catch (err) {
    logger.error(`Failed to fetch hosts: ${err.message}`);
    next(err);
  }
};

export const getHost = async (req, res, next) => {
  try {
    const host = await hostService.findHostById(req.params.id);
    if (!host) {
      logger.warn(`Host not found: ${req.params.id}`);
      return res.status(404).json({ message: "Host not found" });
    }
    res.json(host);
  } catch (err) {
    logger.error(`Failed to fetch host ${req.params.id}: ${err.message}`);
    next(err);
  }
};

export const createHost = async (req, res, next) => {
  try {
    const host = await hostService.createHost(req.body);
    logger.info(`Host created: ${host.id}`);
    res.status(201).json(host);
  } catch (err) {
    logger.error(`Failed to create host: ${err.message}`);
    next(err);
  }
};

export const updateHost = async (req, res, next) => {
  try {
    const host = await hostService.updateHost(req.params.id, req.body);
    logger.info(`Host updated: ${req.params.id}`);
    res.json(host);
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2025"
    ) {
      logger.warn(`Update failed, host not found: ${req.params.id}`);
      return res.status(404).json({ message: "Host not found" });
    }
    logger.error(`Failed to update host ${req.params.id}: ${err.message}`);
    next(err);
  }
};

export const deleteHost = async (req, res, next) => {
  try {
    await hostService.deleteHost(req.params.id);
    logger.info(`Host deleted: ${req.params.id}`);
    res.json({ message: "Host deleted successfully" });
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2025"
    ) {
      logger.warn(`Delete failed, host not found: ${req.params.id}`);
      return res.status(404).json({ message: "Host not found" });
    }
    logger.error(`Failed to delete host ${req.params.id}: ${err.message}`);
    next(err);
  }
};
