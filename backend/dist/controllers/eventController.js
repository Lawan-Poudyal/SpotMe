"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEventHandler = exports.updateEventHandler = exports.getEventHandler = exports.getEventById = exports.createEventHandler = void 0;
const client_1 = require("@prisma/client/runtime/client");
const prismaClientConfig_1 = require("../config/prismaClientConfig");
const dbErrorHash_1 = __importDefault(require("../utils/dbErrorHash"));
const isOwner_1 = require("../utils/isOwner");
const asyncHandler_1 = require("../utils/asyncHandler");
const Error_1 = require("../errors/Error");
const event_validation_1 = require("../validations/event.validation");
const getSessions_1 = require("../utils/getSessions");
const validateSchema_1 = require("../utils/validateSchema");
const validateSyncSchema_1 = require("../utils/validateSyncSchema");
const eventSync_validation_1 = require("../validations/eventSync.validation");
const upload_validation_1 = require("../validations/upload.validation");
const isParticipant_1 = require("../utils/isParticipant");
const redisConfig_1 = require("../config/redisConfig");
const dbError_1 = require("../errors/dbError");
const createEventHandler = async (req, res) => {
    try {
        let { eventName, ownerId } = (0, validateSyncSchema_1.validateData)(eventSync_validation_1.createEventSchema, req.body, res);
        let event = null;
        try {
            event = await prismaClientConfig_1.prisma.$transaction(async (tx) => {
                const newEvent = await tx.event.create({
                    data: { userId: ownerId, eventName },
                });
                await tx.participant.create({
                    data: { eventId: newEvent.id, userId: ownerId },
                });
                return newEvent;
            });
            const cacheKey = `participation-${ownerId}-${event.id}`;
            await redisConfig_1.redis.set(cacheKey, '1', 'EX', 600);
        }
        catch (dbError) {
            if (dbError instanceof client_1.PrismaClientKnownRequestError) {
                throw (0, dbError_1.mapPrismaError)(dbError);
            }
            else
                throw new Error_1.AppError('Error');
        }
        return res.status(200).json({
            success: true,
            data: { ...event, numberOfImages: 0 },
        });
    }
    catch (err) {
        if (err instanceof Error) {
            if (err instanceof dbError_1.ZodValidationError) {
                return res.status(err.status).json(err.options);
            }
            return res.status(500).json({
                success: false,
                err: {
                    name: err.name,
                    message: err.message,
                },
            });
        }
    }
};
exports.createEventHandler = createEventHandler;
const getEventHandler = async (req, res) => {
    try {
        // let's make it so that other users can't see someone else's events
        let { ownerId } = (0, validateSyncSchema_1.validateData)(eventSync_validation_1.getEventSchema, req.query, res);
        const { validatedUserId } = req;
        if (validatedUserId !== ownerId) {
            return res.status(403).json({
                success: false,
                err: {
                    name: 'Unauthorized action intended',
                    message: "You can't get someone elses events",
                },
            });
        }
        let events = [];
        try {
            events = await prismaClientConfig_1.prisma.event.findMany({
                where: {
                    OR: [
                        { userId: ownerId },
                        {
                            participant: {
                                some: {
                                    userId: ownerId,
                                },
                            },
                        },
                    ],
                },
                select: {
                    id: true,
                    userId: true,
                    eventName: true,
                    createdAt: true,
                    updatedAt: true,
                    photoCount: true,
                    thumbnail: {
                        select: {
                            id: true,
                            photo_url: true,
                            width: true,
                            height: true,
                        },
                    },
                },
            });
        }
        catch (dbError) {
            if (dbError instanceof client_1.PrismaClientKnownRequestError) {
                const dbErrorCode = dbError.code;
                const dbErrorName = dbErrorHash_1.default[dbErrorCode];
                if (dbErrorName === 'ForeignKeyConstraintViolation') {
                    return res.status(401).json({
                        success: false,
                        err: {
                            name: "Owner doesn't exist",
                            message: 'The account has been either deleted by the user or as per community guideline',
                        },
                    });
                }
                else
                    throw dbError;
            }
            else
                throw dbError;
        }
        return res.status(200).json({
            success: true,
            data: events,
        });
    }
    catch (err) {
        if (err instanceof Error) {
            if (err instanceof dbError_1.ZodValidationError) {
                return res.status(err.status).json(err.options);
            }
            return res.status(500).json({
                success: false,
                err: {
                    name: err.name,
                    message: err.message,
                },
            });
        }
    }
};
exports.getEventHandler = getEventHandler;
const getEventById = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const session = await (0, getSessions_1.getSession)(req.headers);
    if (!session)
        throw new Error_1.UnauthorizedError();
    const { validatedUserId } = req;
    const { eventId } = (0, validateSchema_1.validateSchema)(upload_validation_1.eventSchema, req.params);
    const hasParticipated = await (0, isParticipant_1.isParticipant)(eventId, validatedUserId);
    if (!hasParticipated) {
        throw new Error_1.ForbiddenError('Event');
    }
    const event = await prismaClientConfig_1.prisma.event.findUnique({
        where: {
            id: eventId,
        },
        select: {
            id: true,
            userId: true,
            eventName: true,
            createdAt: true,
            photoCount: true,
            thumbnail: {
                select: {
                    id: true,
                    photo_url: true,
                    width: true,
                    height: true,
                },
            },
            participant: {
                select: {
                    userId: true,
                },
            },
        },
    });
    res.status(200).json({
        success: true,
        data: event,
    });
});
exports.getEventById = getEventById;
const updateEventHandler = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { validatedUserId } = req;
    const { eventId, eventName, thumbNailId } = (0, validateSchema_1.validateSchema)(event_validation_1.updateEventSchema, req.body);
    try {
        const participated = await (0, isOwner_1.isOwner)(eventId, eventName, validatedUserId);
        console.log("FROM OWNER SECTION =====================");
        console.log(participated);
        if (!participated)
            throw new Error_1.ForbiddenError();
        const data = await prismaClientConfig_1.prisma.event.update({
            where: { id: eventId },
            data: {
                ...(eventName !== undefined && { eventName }),
                ...(thumbNailId !== undefined && { thumbnailId: thumbNailId }),
            },
            select: {
                id: true,
                userId: true,
                eventName: true,
                createdAt: true,
                updatedAt: true,
                photoCount: true,
                thumbnail: {
                    select: {
                        id: true,
                        photo_url: true,
                        width: true,
                        height: true,
                    },
                },
            },
        });
        if (!!thumbNailId) {
            console.log('Setting up the thumbnail Cache');
            const cacheKey = `thumbnail-${eventId}`;
            await redisConfig_1.redis.set(cacheKey, thumbNailId, 'EX', 600);
        }
        res.status(200).json({ success: true, data });
    }
    catch (err) {
        if (err instanceof client_1.PrismaClientKnownRequestError && err.code === 'P2025') {
            throw new Error_1.NotFoundError(`Event with id ${eventId} not found`);
        }
        throw err;
    }
});
exports.updateEventHandler = updateEventHandler;
const deleteEventHandler = async (req, res) => {
    try {
        const { validatedUserId } = req;
        let { ownerId, eventName, eventId } = (0, validateSyncSchema_1.validateData)(eventSync_validation_1.deleteEventSchema, req.body, res);
        if (validatedUserId !== ownerId) {
            return res.status(403).json({
                success: false,
                err: {
                    name: 'Unauthorized action intended',
                    message: "You can't get someone elses events",
                },
            });
        }
        try {
            await prismaClientConfig_1.prisma.event.delete({
                where: {
                    eventName_userId: {
                        userId: ownerId,
                        eventName: eventName,
                    },
                },
            });
            return res.status(200).json({
                success: true,
            });
        }
        catch (dbError) {
            if (dbError instanceof client_1.PrismaClientKnownRequestError) {
                const dbErrorCode = dbError.code;
                const dbErrorName = dbErrorHash_1.default[dbErrorCode];
                if (dbErrorName === 'KeyNotFoundError') {
                    return res.status(404).json({
                        success: false,
                        err: {
                            name: `Couldn't find ${eventName}`,
                            message: `You have never created a event named ${eventName}`,
                        },
                    });
                }
                else
                    throw dbError;
            }
            else
                throw dbError;
        }
    }
    catch (err) {
        if (err instanceof Error) {
            if (err instanceof dbError_1.ZodValidationError) {
                return res.status(err.status).json(err.options);
            }
            console.log(err.name);
            console.log(err.stack);
            console.log(err.message);
            return res.status(500).json({
                success: false,
                err: {
                    name: err.name,
                    message: err.message,
                },
            });
        }
    }
};
exports.deleteEventHandler = deleteEventHandler;
//# sourceMappingURL=eventController.js.map