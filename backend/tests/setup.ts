import { afterAll } from "vitest";
import { prisma } from "../src/config/prismaClientConfig";

afterAll(async () => {
  await prisma.$disconnect();
});
