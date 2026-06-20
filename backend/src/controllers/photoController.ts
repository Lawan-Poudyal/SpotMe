import type { Response, Request } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ValidationError } from '../errors/Error';
import { prisma } from '../config/prismaClientConfig';

const getPhotoHandler = asyncHandler(async (req: Request, res: Response) => {
  const eventId = req.query.eventId;

  if (typeof eventId !== 'string') {
    throw new ValidationError('Missing or invalid eventId query parameter');
  }

  const photos = await prisma.photo.findMany({
    where: {
      event_id: eventId,
    },
  });

  res.status(200).json({
    success: true,
    data: photos,
  });
});
