import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function authenticateUser(username, password) {
  const user = await prisma.user.findUnique({ where: { username } });
  if (user && (await bcrypt.compare(password, user.password))) {
    const token = jwt.sign(
      { id: user.id, role: "user" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    return { token, user };
  }
  return null;
}

export async function authenticateHost(username, password) {
  const host = await prisma.host.findUnique({ where: { username } });
  if (host && (await bcrypt.compare(password, host.password))) {
    const token = jwt.sign(
      { id: host.id, role: "host" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    return { token, host };
  }
  return null;
}
