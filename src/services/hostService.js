import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function findAllHosts() {
  return prisma.host.findMany({ include: { listings: true } });
}

export async function findHostById(id) {
  return prisma.host.findUnique({ where: { id }, include: { listings: true } });
}

export const findHostByName = async (name) => {
  return prisma.host.findFirst({
    where: { name },
  });
};

export async function createHost(data) {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  return prisma.host.create({ data: { ...data, password: hashedPassword } });
}

export async function updateHost(id, data) {
  return prisma.host.update({ where: { id }, data });
}

export async function deleteHost(id) {
  return prisma.host.delete({ where: { id } });
}
