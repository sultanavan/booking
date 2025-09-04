import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding single user...");

  const password = await bcrypt.hash("password123", 10);

  await prisma.user.upsert({
    where: { username: "jdoe" },
    update: {},
    create: {
      id: "e5678901-23f0-1234-5678-9abcdef01234",
      username: "jdoe",
      email: "jdoe@example.com",
      password,
      name: "John Doe",
      phoneNumber: "+1234567890",
      pictureUrl: "https://i.pravatar.cc/150?u=jdoe",
    },
  });

  console.log("✅ User jdoe seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error while seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
