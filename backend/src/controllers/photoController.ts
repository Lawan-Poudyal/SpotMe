import type { Response, Request } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { UnauthorizedError, NotFoundError, ForbiddenError } from '../errors/Error';
import { prisma } from '../config/prismaClientConfig';
import { cloudinary } from '../lib/cloudinary';
import { getSession } from '../utils/getSessions';
import { validateSchema } from '../utils/validateSchema';
import { deletePhotoSchema, eventSchema } from '../validations/upload.validation';
import { isThumbnail } from '../utils/isThumbnail';

const getPhotoHandler = asyncHandler(async (req: Request, res: Response) => {
  const { eventId } = validateSchema(eventSchema, req.query);

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
      public_id: true,
      height: true,
    },
  });


  res.status(200).json({
    success: true,
    data: photos,
  });
});

const deletePhotoHandler = asyncHandler(async (req: Request, res: Response) => {
  const {validatedUserId} = req
  const session = await getSession(req.headers as HeadersInit);
  if (!session) throw new UnauthorizedError();

  const { photoId , eventId} = validateSchema(deletePhotoSchema, req.query);

  const thumbnailed = await isThumbnail(eventId , photoId)

  if(thumbnailed) throw new ForbiddenError('User doesnot have permission to delete this photo')

  const dbPhoto = await prisma.photo.findUnique({
    where: { id: photoId },
    include: {
      event: {
        select: {
          userId: true,
          photoCount: true,
        },
      },
    },
  });

  if (!dbPhoto) throw new NotFoundError('Photo');

  const isUploader = dbPhoto.uploaded_by === validatedUserId
  const isEventOwner = dbPhoto.event?.userId === validatedUserId 
  if (!isUploader && !isEventOwner) {
    throw new ForbiddenError('User does not have permission to delete this photo');
  }

  const newPhotoCount = Math.max(0, (dbPhoto.event?.photoCount ?? 1) - 1);

  await prisma.$transaction([
    prisma.photo.delete({ where: { id: photoId } }),
    prisma.event.update({
      where: { id: dbPhoto.event_id },
      data: { photoCount: newPhotoCount },
    }),
  ]);

  res.status(200).json({ success: true, message: 'Photo deleted successfully' });

  cloudinary.uploader.destroy(dbPhoto.public_id).catch((err) => {
    console.error(`Failed to delete Cloudinary asset ${dbPhoto.public_id}:`, err);
  });
});

export { getPhotoHandler, deletePhotoHandler };
