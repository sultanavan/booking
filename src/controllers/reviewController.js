import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getReviews = async (req, res, next) => {
  try {
    const reviews = await prisma.review.findMany({
      include: { user: true, property: true },
    });
    res.status(200).json(reviews);
  } catch (err) {
    next(err);
  }
};

export const getReview = async (req, res, next) => {
  try {
    const review = await prisma.review.findUnique({
      where: { id: req.params.id },
      include: { user: true, property: true },
    });
    if (!review) return res.status(404).json({ message: "Review not found" });
    res.status(200).json(review);
  } catch (err) {
    next(err);
  }
};

export const createReview = async (req, res, next) => {
  try {
    const review = await prisma.review.create({ data: req.body });
    res.status(201).json(review);
  } catch (err) {
    next(err);
  }
};

export const updateReview = async (req, res, next) => {
  try {
    const review = await prisma.review.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.status(200).json(review);
  } catch (err) {
    next(err);
  }
};

export const deleteReview = async (req, res, next) => {
  try {
    await prisma.review.delete({ where: { id: req.params.id } });
    res.status(200).json({ message: "Review deleted successfully" });
  } catch (err) {
    next(err);
  }
};
