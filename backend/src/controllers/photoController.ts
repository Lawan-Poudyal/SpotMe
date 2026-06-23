import type { Response, Request } from 'express';
import { auth } from '../config/auth';
import { asyncHandler } from '../utils/asyncHandler';
import { ValidationError, UnauthorizedError, NotFoundError, ForbiddenError } from '../errors/Error';
import { prisma } from '../config/prismaClientConfig';
import { cloudinary } from '../lib/cloudinary';

const getPhotoHandler = asyncHandler(async (req: Request, res: Response) => {
  const eventId = req.query.eventid;
  if (typeof eventId !== 'string') {
    throw new ValidationError('Missing or invalid eventId query parameter');
  }

  const photos = await prisma.photo.findMany({
    where: {
      event_id: eventId,
    },
    select: {
      id: true,
      photo_url: true,
      event_id: true,
      uploaded_at: true,
      uploaded_by: true,
      width: true,
      public_id : true,
      height: true,
    },
  });

  res.status(200).json({
    success: true,
    data: photos,
  });
});

const deletePhotoHandler = asyncHandler(async (req: Request, res: Response) => {
  const photoId = req.query.photoid as string;
  const eventId = req.query.eventid as string;

  if (!photoId || typeof photoId !== 'string')
    throw new ValidationError('Missing photoId parameter');
  if (!eventId || typeof eventId !== 'string')
    throw new ValidationError('Missing eventId parameter');

  console.time('session');
  const [session, [dbPhoto, eventOwner]] = await Promise.all([
    auth.api.getSession({ headers: req.headers as HeadersInit }),
    Promise.all([
      prisma.photo.findUnique({ where: { id: photoId } }),
      prisma.event.findUnique({ where: { id: eventId }, select: { userId: true } }),
    ]),
  ]);
  console.timeEnd('session');

  if (!session) throw new UnauthorizedError();
  if (!dbPhoto) throw new NotFoundError('Photo');
  if (dbPhoto.uploaded_by !== session.user.id || eventOwner?.userId !== session.user.id)
    throw new ForbiddenError('You do not have permission to delete this photo');

  await prisma.photo.delete({ where: { id: photoId } });

  res.status(200).json({ success: true, message: 'Photo deleted successfully' });

  cloudinary.uploader.destroy(dbPhoto.public_id).catch((err) => {
    console.error('Error deleting photo from Cloudinary:', err);
  });
});

export { getPhotoHandler, deletePhotoHandler };
