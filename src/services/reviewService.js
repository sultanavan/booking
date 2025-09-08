import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function findAllReviews() {
  return prisma.review.findMany({ include: { user: true, property: true } });
}

export async function findReviewById(id) {
  return prisma.review.findUnique({
    where: { id },
    include: { user: true, property: true },
  });
}

export async function createReview(data) {
  return prisma.review.create({
    data,
    include: { user: true, property: true },
  });
}

export async function updateReview(id, data) {
  return prisma.review.update({
    where: { id },
    data,
    include: { user: true, property: true },
  });
}

export async function deleteReview(id) {
  return prisma.review.delete({ where: { id } });
}
