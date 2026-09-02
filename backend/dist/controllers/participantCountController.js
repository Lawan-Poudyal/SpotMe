"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getParticipants = void 0;
const prismaClientConfig_1 = require("../config/prismaClientConfig");
const asyncHandler_1 = require("../utils/asyncHandler");
const Error_1 = require("../errors/Error");
const validateSchema_1 = require("../utils/validateSchema");
const eventSync_validation_1 = require("../validations/eventSync.validation");
const isParticipant_1 = require("../utils/isParticipant");
exports.getParticipants = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { eventId, ownerId } = (0, validateSchema_1.validateSchema)(eventSync_validation_1.getParticipantsSchema, req.params);
    const { validatedUserId } = req;
    if (validatedUserId != ownerId) {
        throw new Error_1.ForbiddenError('You cannot access this.');
    }
    const allowed = await (0, isParticipant_1.isParticipant)(eventId, ownerId);
    if (!allowed) {
        throw new Error_1.ForbiddenError('You are not a participant of this event');
    }
    const event = await prismaClientConfig_1.prisma.event.findUnique({
        where: { id: eventId },
        select: { id: true },
    });
    if (!event) {
        throw new Error_1.NotFoundError('Event');
    }
    const participants = await prismaClientConfig_1.prisma.participant.findMany({
        where: {
            eventId
        },
        select: {
            user: {
                select: {
                    name: true,
                    profile_pic_link: true,
                },
            },
        },
    });
    const participantList = participants.map((p) => ({
        name: p.user.name,
        profilePic: p.user.profile_pic_link,
    }));
    res.status(200).json({
        success: true,
        count: participantList.length,
        participants: participantList,
    });
});
//# sourceMappingURL=participantCountController.js.map