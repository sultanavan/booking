import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getProperties = async (req, res, next) => {
  try {
    const { location, pricePerNight } = req.query;
    const filters = {};
    if (location) filters.location = location;
    if (pricePerNight) filters.pricePerNight = parseFloat(pricePerNight);

    const properties = await prisma.property.findMany({
      where: filters,
      include: { host: true, bookings: true, reviews: true },
    });
    res.status(200).json(properties);
  } catch (err) {
    next(err);
  }
};

export const getProperty = async (req, res, next) => {
  try {
    const property = await prisma.property.findUnique({
      where: { id: req.params.id },
      include: { host: true, bookings: true, reviews: true },
    });
    if (!property)
      return res.status(404).json({ message: "Property not found" });
    res.status(200).json(property);
  } catch (err) {
    next(err);
  }
};

export const createProperty = async (req, res, next) => {
  try {
    const property = await prisma.property.create({ data: req.body });
    res.status(201).json(property);
  } catch (err) {
    next(err);
  }
};

export const updateProperty = async (req, res, next) => {
  try {
    const property = await prisma.property.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.status(200).json(property);
  } catch (err) {
    next(err);
  }
};

export const deleteProperty = async (req, res, next) => {
  try {
    await prisma.property.delete({ where: { id: req.params.id } });
    res.status(200).json({ message: "Property deleted successfully" });
  } catch (err) {
    next(err);
  }
};
