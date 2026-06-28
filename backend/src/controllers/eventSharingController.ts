import type { Response, Request } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { validateSchema } from '../utils/validateSchema';
import { eventSchema } from '../validations/upload.validation';
import { getSession } from '../utils/getSessions';
import { ForbiddenError, NotFoundError, UnauthorizedError } from '../errors/Error';
import { prisma } from '../config/prismaClientConfig';

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

  const inviteLink = await prisma.inviteLink.upsert({
    where: { eventId },
    update: {},
    create: { eventId, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
  });

  res.status(201).json({
    success: true,
    data: { token: inviteLink.token, eventId: inviteLink.eventId },
  });
});

export { inviteLinkHandler };
