import type { Response, Request } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { validateSchema } from '../utils/validateSchema';
import { eventSchema } from '../validations/upload.validation';
import { NotFoundError, UnauthorizedError } from '../errors/Error';
import { prisma } from '../config/prismaClientConfig';
import { redis } from '../config/redisConfig';
import { inviteLinkSchema } from '../validations/inviteLink.validation';

const inviteLinkHandler = asyncHandler(async (req: Request, res: Response) => {
  const { validatedUserId } = req;
  const { eventId } = validateSchema(eventSchema, req.params);

  const participant = await prisma.participant.findUnique({
    where: {
      eventId_userId: {
        eventId,
        userId: validatedUserId,
      },
    },
  });
  if (!participant) throw new UnauthorizedError('You are not a participant of this event');

  let token = await redis.get(`invitelink:${eventId}`);
  const oneWeekFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  if (!token) {
    const inviteLink = await prisma.inviteLink.upsert({
      where: { eventId },
      update: { expiresAt: oneWeekFromNow },
      create: { eventId, expiresAt: oneWeekFromNow },
    });
    token = inviteLink.token;
    await redis.set(`invitelink:${eventId}`, token, 'EX', 120);
  }

  res.status(201).json({
    success: true,
    data: { token, eventId },
  });
});

const joinEventHandler = asyncHandler(async (req: Request, res: Response) => {
  const { validatedUserId } = req;
  const { token } = validateSchema(inviteLinkSchema, req.params);

  const inviteLink = await prisma.inviteLink.findUnique({ where: { token } });
  if (!inviteLink) throw new NotFoundError('Event');

  const returnVal = await prisma.participant.upsert({
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
  await redis.set(cacheKey, '1', 'EX', 600);

  res.status(201).json({
    success: true,
    data: { eventId: inviteLink.eventId },
  });
});

export { inviteLinkHandler, joinEventHandler };
