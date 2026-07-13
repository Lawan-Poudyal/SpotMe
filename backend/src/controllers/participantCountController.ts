import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { prisma } from '../config/prismaClientConfig';
import type { Request, Response } from 'express';
import dbErrorHash from '../utils/dbErrorHash';
import type { dbErrorType } from '../utils/dbErrorHash';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError, ForbiddenError, NotFoundError, UnauthorizedError } from '../errors/Error';
import { updateEventSchema } from '../validations/event.validation';
import { getSession } from '../utils/getSessions';
import { validateSchema } from '../utils/validateSchema';
import { validateData } from '../utils/validateSyncSchema';
import { createEventSchema, deleteEventSchema, getEventSchema, getParticipantsSchema } from '../validations/eventSync.validation';
import type { CreateEventPayload, DeleteEventPayload, GetEventPayload } from '../validations/eventSync.validation';
import { eventSchema } from '../validations/upload.validation';
import { isParticipant } from '../utils/isParticipant';
import { redis } from '../config/redisConfig';
import { mapPrismaError, ZodValidationError } from '../errors/dbError';
import { asyncSend } from 'bullmq';


export const getParticipants = asyncHandler(async (req, res: Response) => {
    const { eventId, ownerId } = validateSchema(getParticipantsSchema, req.params);
    const { validatedUserId } = req
    if (validatedUserId != ownerId) {
        throw new ForbiddenError('You cannot access this.');
    }
    const allowed = await isParticipant(eventId, ownerId);

    if (!allowed) {
        throw new ForbiddenError('You are not a participant of this event');
    }

    const event = await prisma.event.findUnique({
        where: { id: eventId },
        select: { id: true },
    });

    if (!event) {
        throw new NotFoundError('Event');
    }

    const participants = await prisma.participant.findMany({
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