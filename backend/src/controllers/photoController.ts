import type { Response, Request } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { UnauthorizedError, NotFoundError, ForbiddenError } from '../errors/Error';
import { prisma } from '../config/prismaClientConfig';
import { cloudinary } from '../lib/cloudinary';
import { getSession } from '../utils/getSessions';
import { validateSchema } from '../utils/validateSchema';
import { deletePhotoSchema, signUploadSchema } from '../validations/upload.validation';

const getPhotoHandler = asyncHandler(async (req: Request, res: Response) => {
  const { eventId } = validateSchema(signUploadSchema, req.query);

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
  const session = await getSession(req.headers as HeadersInit);
  if (!session) throw new UnauthorizedError();

  const { photoId } = validateSchema(deletePhotoSchema, req.query);
  const dbPhoto = await prisma.photo.findUnique({
    where: { id: photoId },
    include: {
      event: {
        select: {
          userId: true,
        },
      },
    },
  });

  if (!dbPhoto) throw new NotFoundError('Photo');

  const isUploader = dbPhoto.uploaded_by === session.user.id;
  const isEventOwner = dbPhoto.event?.userId === session.user.id;
  if (!isUploader && !isEventOwner) {
    throw new ForbiddenError('User does not have permission to delete this photo');
  }

  await prisma.$transaction([
    prisma.photo.delete({ where: { id: photoId } }),
    prisma.event.update({
      where: { id: dbPhoto.event_id },
      data: { photoCount: { decrement: 1 } },
    }),
  ]);

  res.status(200).json({ success: true, message: 'Photo deleted successfully' });

  cloudinary.uploader.destroy(dbPhoto.public_id).catch((err) => {
    console.error(`Failed to delete Cloudinary asset ${dbPhoto.public_id}:`, err);
  });
});

export { getPhotoHandler, deletePhotoHandler };
