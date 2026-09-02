"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const adapter_pg_1 = require("@prisma/adapter-pg");
const index_1 = require("../../generated/prisma/index");
const databaseString = (process.env.ENVIRONMENT === 'local') ? process.env.LOCAL_DATABASE_URL : process.env.DATABASE_URL;
const adapter = new adapter_pg_1.PrismaPg({
    connectionString: databaseString,
    max: 10,
});
const prisma = new index_1.PrismaClient({
    adapter,
});
exports.prisma = prisma;
//# sourceMappingURL=prismaClientConfig.js.map