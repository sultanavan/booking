import * as propertyService from "../services/propertyService.js";
import { Prisma } from "@prisma/client";
import logger from "../utils/logger.js";

export const getProperties = async (req, res, next) => {
  try {
    const { location, pricePerNight } = req.query;

    if (location || pricePerNight) {
      const filters = {};
      if (location) filters.location = location;
      if (pricePerNight) filters.pricePerNight = parseFloat(pricePerNight);

      const properties = await propertyService.findPropertiesByFilters(filters);
      if (!properties.length)
        return res.status(404).json({ message: "No properties found" });
      return res.json(properties);
    }

    const properties = await propertyService.findAllProperties();
    res.json(properties);
  } catch (err) {
    logger.error(`Failed to fetch properties: ${err.message}`);
    next(err);
  }
};

export const getProperty = async (req, res, next) => {
  try {
    const property = await propertyService.findPropertyById(req.params.id);
    if (!property) {
      logger.warn(`Property not found: ${req.params.id}`);
      return res.status(404).json({ message: "Property not found" });
    }
    res.json(property);
  } catch (err) {
    logger.error(`Failed to fetch property ${req.params.id}: ${err.message}`);
    next(err);
  }
};

export const createProperty = async (req, res, next) => {
  try {
    const { amenityIds, ...data } = req.body;
    const property = await propertyService.createProperty(data, amenityIds);
    logger.info(`Property created: ${property.id}`);
    res.status(201).json(property);
  } catch (err) {
    logger.error(`Failed to create property: ${err.message}`);
    next(err);
  }
};

export const updateProperty = async (req, res, next) => {
  try {
    const { amenityIds, ...data } = req.body;
    const property = await propertyService.updateProperty(
      req.params.id,
      data,
      amenityIds
    );
    logger.info(`Property updated: ${req.params.id}`);
    res.json(property);
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2025"
    ) {
      logger.warn(`Update failed, property not found: ${req.params.id}`);
      return res.status(404).json({ message: "Property not found" });
    }
    logger.error(`Failed to update property ${req.params.id}: ${err.message}`);
    next(err);
  }
};

export const deleteProperty = async (req, res, next) => {
  try {
    await propertyService.deleteProperty(req.params.id);
    logger.info(`Property deleted: ${req.params.id}`);
    res.json({ message: "Property deleted successfully" });
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2025"
    ) {
      logger.warn(`Delete failed, property not found: ${req.params.id}`);
      return res.status(404).json({ message: "Property not found" });
    }
    logger.error(`Failed to delete property ${req.params.id}: ${err.message}`);
    next(err);
  }
};
