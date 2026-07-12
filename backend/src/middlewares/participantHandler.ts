import { Request, Response, NextFunction } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { validateSchema } from '../utils/validateSchema';
import { eventSchema } from '../validations/upload.validation';
import { prisma } from '../config/prismaClientConfig';
import { UnauthorizedError } from '../errors/Error';

export const checkParticipant = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { eventId } = validateSchema(eventSchema, req.query);
    console.log(eventId, req.validatedUserId);

    const participant = await prisma.participant.findUnique({
      where: {
        eventId_userId: {
          userId: req.validatedUserId,
          eventId,
        },
      },
    });

    if (!participant) {
      throw new UnauthorizedError();
    }
    req.eventId = eventId;
    next();
  },
);
