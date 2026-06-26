import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../generated/prisma/index';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
  max: 10,
});

const prisma = new PrismaClient({
  adapter,
});

export { prisma };
