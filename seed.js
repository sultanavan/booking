import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

async function loadJSON(fileName) {
  const filePath = path.join(process.cwd(), "src", "data", fileName);
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

async function main() {
  console.log("🌱 Seeding database...");

  // Load data
  const { users } = await loadJSON("users.json");
  const { hosts } = await loadJSON("hosts.json");
  const { properties } = await loadJSON("properties.json");
  const { bookings } = await loadJSON("bookings.json");
  const { reviews } = await loadJSON("reviews.json");
  const { amenities } = await loadJSON("amenities.json");

  // --- Users ---
  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    await prisma.user.upsert({
      where: { id: user.id },
      update: {},
      create: { ...user, password: hashedPassword },
    });
  }
  console.log("✅ Users seeded");

  // --- Hosts ---
  for (const host of hosts) {
    const hashedPassword = await bcrypt.hash(host.password, 10);
    await prisma.host.upsert({
      where: { id: host.id },
      update: {},
      create: { ...host, password: hashedPassword },
    });
  }
  console.log("✅ Hosts seeded");

  // --- Properties ---
  for (const property of properties) {
    await prisma.property.upsert({
      where: { id: property.id },
      update: {},
      create: property,
    });
  }
  console.log("✅ Properties seeded");

  // --- Bookings ---
  for (const booking of bookings) {
    await prisma.booking.upsert({
      where: { id: booking.id },
      update: {},
      create: {
        ...booking,
        checkinDate: new Date(booking.checkinDate),
        checkoutDate: new Date(booking.checkoutDate),
      },
    });
  }
  console.log("✅ Bookings seeded");

  // --- Reviews ---
  for (const review of reviews) {
    await prisma.review.upsert({
      where: { id: review.id },
      update: {},
      create: review,
    });
  }
  console.log("✅ Reviews seeded");

  // --- Amenities ---
  for (const amenity of amenities) {
    await prisma.amenity.upsert({
      where: { id: amenity.id },
      update: {},
      create: amenity,
    });
  }
  console.log("✅ Amenities seeded");

  console.log("🌱 Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
