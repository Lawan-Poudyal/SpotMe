import type { Response, Request } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { validateSchema } from '../utils/validateSchema';
import { eventSchema } from '../validations/upload.validation';
import { getSession } from '../utils/getSessions';
import { ForbiddenError, NotFoundError, UnauthorizedError } from '../errors/Error';
import { prisma } from '../config/prismaClientConfig';
import { redis } from '../config/redisConfig';

const inviteLinkHandler = asyncHandler(async (req: Request, res: Response) => {
  const { eventId } = validateSchema(eventSchema, req.body);

  const session = await getSession(req.headers as HeadersInit);
  if (!session) throw new UnauthorizedError();

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

export { inviteLinkHandler };
