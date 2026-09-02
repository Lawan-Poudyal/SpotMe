"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connection = void 0;
const redisUrl = process.env.UPSTASH_REDIS_HOST;
const redisPassword = process.env.UPSTASH_REDIS_PASSWORD || undefined;
exports.connection = {
    host: redisUrl,
    port: 6379,
    password: redisPassword,
    // tls : {}
};
//# sourceMappingURL=redis.js.map