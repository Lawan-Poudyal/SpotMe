"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.joinEventHandler = exports.inviteLinkHandler = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const validateSchema_1 = require("../utils/validateSchema");
const upload_validation_1 = require("../validations/upload.validation");
const Error_1 = require("../errors/Error");
const prismaClientConfig_1 = require("../config/prismaClientConfig");
const redisConfig_1 = require("../config/redisConfig");
const inviteLink_validation_1 = require("../validations/inviteLink.validation");
const inviteLinkHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { validatedUserId } = req;
    const { eventId } = (0, validateSchema_1.validateSchema)(upload_validation_1.eventSchema, req.params);
    const participant = await prismaClientConfig_1.prisma.participant.findUnique({
        where: {
            eventId_userId: {
                eventId,
                userId: validatedUserId,
            },
        },
    });
    if (!participant)
        throw new Error_1.UnauthorizedError('You are not a participant of this event');
    let token = await redisConfig_1.redis.get(`invitelink:${eventId}`);
    const oneWeekFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    if (!token) {
        const inviteLink = await prismaClientConfig_1.prisma.inviteLink.upsert({
            where: { eventId },
            update: { expiresAt: oneWeekFromNow },
            create: { eventId, expiresAt: oneWeekFromNow },
        });
        token = inviteLink.token;
        await redisConfig_1.redis.set(`invitelink:${eventId}`, token, 'EX', 120);
    }
    res.status(201).json({
        success: true,
        data: { token, eventId },
    });
});
exports.inviteLinkHandler = inviteLinkHandler;
const joinEventHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { validatedUserId } = req;
    const { token } = (0, validateSchema_1.validateSchema)(inviteLink_validation_1.inviteLinkSchema, req.params);
    const inviteLink = await prismaClientConfig_1.prisma.inviteLink.findUnique({ where: { token } });
    if (!inviteLink)
        throw new Error_1.NotFoundError('Event');
    const returnVal = await prismaClientConfig_1.prisma.participant.upsert({
        where: {
            eventId_userId: {
                userId: validatedUserId,
                eventId: inviteLink.eventId,
            },
        },
        update: {},
        create: {
            userId: validatedUserId,
            eventId: inviteLink.eventId,
        },
    });
    const cacheKey = `participation-${validatedUserId}-${returnVal.eventId}`;
    await redisConfig_1.redis.set(cacheKey, '1', 'EX', 600);
    res.status(201).json({
        success: true,
        data: { eventId: inviteLink.eventId },
    });
});
exports.joinEventHandler = joinEventHandler;
//# sourceMappingURL=eventSharingController.js.map