import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../generated/prisma/index';

const databaseString = (process.env.ENVIRONMENT === 'local') ? process.env.LOCAL_DATABASE_URL! : process.env.DATABASE_URL!

const adapter = new PrismaPg({
  connectionString: databaseString,
  max: 10,
});

const prisma = new PrismaClient({
  adapter,
});

export { prisma };
