"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isOwner = void 0;
const prismaClientConfig_1 = require("../config/prismaClientConfig");
const redisConfig_1 = require("../config/redisConfig");
const isOwner = async (eventId, eventName, userId) => {
    const cacheKey = `owner-${userId}-${eventId}`;
    let hasOwned = (await redisConfig_1.redis.get(cacheKey));
    if (hasOwned !== null) {
        return hasOwned === '1';
    }
    let dbReadParticipation = (await prismaClientConfig_1.prisma.event.findUnique({
        where: {
            id: eventId
        },
        select: {
            userId: true
        },
    }));
    let hasOwnership = dbReadParticipation?.userId;
    await redisConfig_1.redis.set(cacheKey, hasOwnership ? '1' : '0', 'EX', dbReadParticipation ? 600 : 60);
    return !!hasOwnership;
};
exports.isOwner = isOwner;
//# sourceMappingURL=isOwner.js.map