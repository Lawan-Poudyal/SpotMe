import type { Response, Request } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { validateSchema } from '../utils/validateSchema';
import { eventSchema } from '../validations/upload.validation';
import { getSession } from '../utils/getSessions';
import { ForbiddenError, NotFoundError, UnauthorizedError } from '../errors/Error';
import { prisma } from '../config/prismaClientConfig';
import { redis } from '../config/redisConfig';
import { inviteLinkSchema } from '../validations/inviteLink.validation';

const inviteLinkHandler = asyncHandler(async (req: Request, res: Response) => {
  const session = await getSession(req.headers as HeadersInit);
  if (!session) throw new UnauthorizedError();

  const { eventId } = validateSchema(eventSchema, req.body);
  const event = await prisma.event.findUnique({
    where: {
      id: eventId,
    },
  });

  if (!event) throw new NotFoundError('Event');
  if (event.userId !== session.user.id) throw new ForbiddenError();

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

const joinEvent = asyncHandler(async (req: Request, res: Response) => {
  const session = await getSession(req.headers as HeadersInit);
  if (!session) throw new UnauthorizedError();

  const { eventId, token } = validateSchema(inviteLinkSchema, req.body);
  const inviteLink = await prisma.inviteLink.findUnique({ where: { eventId } });

  if (!inviteLink || token != inviteLink.token) throw new NotFoundError('Event');
  await prisma.participant.upsert({
    where: {
      userId_eventId: {
        userId: session.user.id,
        eventId,
      },
    },
    update: {},
    create: {
      userId: session.user.id,
      eventId,
    },
  });

  res.status(201).json({
    success: true,
    data: { eventId },
  });
});

export { inviteLinkHandler };
