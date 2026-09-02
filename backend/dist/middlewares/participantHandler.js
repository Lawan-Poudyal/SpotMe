"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkParticipant = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const validateSchema_1 = require("../utils/validateSchema");
const upload_validation_1 = require("../validations/upload.validation");
const prismaClientConfig_1 = require("../config/prismaClientConfig");
const Error_1 = require("../errors/Error");
exports.checkParticipant = (0, asyncHandler_1.asyncHandler)(async (req, res, next) => {
    const { eventId } = (0, validateSchema_1.validateSchema)(upload_validation_1.eventSchema, req.query);
    console.log(eventId, req.validatedUserId);
    const participant = await prismaClientConfig_1.prisma.participant.findUnique({
        where: {
            eventId_userId: {
                userId: req.validatedUserId,
                eventId,
            },
        },
    });
    if (!participant) {
        throw new Error_1.UnauthorizedError();
    }
    req.eventId = eventId;
    next();
});
//# sourceMappingURL=participantHandler.js.map