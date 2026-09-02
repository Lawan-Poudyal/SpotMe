"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisPubSubClient = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const redisURL = process.env.REDIS_URL;
if (!redisURL) {
    throw new Error("Redis URL value undefined");
}
exports.redisPubSubClient = new ioredis_1.default(redisURL);
//# sourceMappingURL=redisPubSub.js.map