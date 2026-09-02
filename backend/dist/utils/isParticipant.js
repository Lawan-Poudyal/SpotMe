"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isParticipant = void 0;
const prismaClientConfig_1 = require("../config/prismaClientConfig");
const redisConfig_1 = require("../config/redisConfig");
const isParticipant = async (eventId, userId) => {
    const cacheKey = `participation-${userId}-${eventId}`;
    let hasParticipated = (await redisConfig_1.redis.get(cacheKey));
    if (hasParticipated !== null) {
        return hasParticipated === '1';
    }
    let dbReadParticipation = (await prismaClientConfig_1.prisma.participant.findUnique({
        where: {
            eventId_userId: {
                eventId: eventId,
                userId: userId,
            },
        },
        select: {
            id: true,
        },
    }));
    dbReadParticipation = !!dbReadParticipation;
    await redisConfig_1.redis.set(cacheKey, dbReadParticipation ? '1' : '0', 'EX', dbReadParticipation ? 600 : 60);
    return dbReadParticipation;
};
exports.isParticipant = isParticipant;
//# sourceMappingURL=isParticipant.js.map