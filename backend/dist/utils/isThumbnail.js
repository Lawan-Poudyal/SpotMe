"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isThumbnail = void 0;
const prismaClientConfig_1 = require("../config/prismaClientConfig");
const redisConfig_1 = require("../config/redisConfig");
const isThumbnail = async (eventId, photoId) => {
    const cacheKey = `thumbnail-${eventId}`;
    const cachedThumbnailId = await redisConfig_1.redis.get(cacheKey);
    if (!!cachedThumbnailId) {
        console.log("Cache hit");
        return cachedThumbnailId === photoId;
    }
    console.log("Cache miss");
    const eventThumbnail = await prismaClientConfig_1.prisma.photo.findUnique({
        where: {
            id: photoId
        },
        select: {
            event: {
                select: {
                    thumbnailId: true
                }
            }
        }
    });
    await redisConfig_1.redis.set(cacheKey, eventThumbnail?.event.thumbnailId, 'EX', 600);
    console.log('From the thing ', eventThumbnail?.event.thumbnailId === photoId);
    return eventThumbnail?.event.thumbnailId === photoId;
};
exports.isThumbnail = isThumbnail;
//# sourceMappingURL=isThumbnail.js.map