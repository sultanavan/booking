import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function findAllProperties(filters) {
  return prisma.property.findMany({
    where: filters,
    include: {
      host: true,
      reviews: true,
      bookings: true,
      amenities: { include: { amenity: true } },
    },
  });
}

export async function findPropertyById(id) {
  return prisma.property.findUnique({
    where: { id },
    include: {
      host: true,
      reviews: true,
      bookings: true,
      amenities: { include: { amenity: true } },
    },
  });
}

export async function createProperty(data, amenityIds) {
  return prisma.property.create({
    data: {
      ...data,
      amenities: amenityIds
        ? {
            create: amenityIds.map((id) => ({ amenity: { connect: { id } } })),
          }
        : undefined,
    },
    include: { host: true, amenities: { include: { amenity: true } } },
  });
}

export async function updateProperty(id, data, amenityIds) {
  return prisma.property.update({
    where: { id },
    data: {
      ...data,
      ...(amenityIds && {
        amenities: {
          deleteMany: {},
          create: amenityIds.map((id) => ({ amenity: { connect: { id } } })),
        },
      }),
    },
    include: { host: true, amenities: { include: { amenity: true } } },
  });
}

export async function deleteProperty(id) {
  return prisma.property.delete({ where: { id } });
}
