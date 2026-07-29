import type { Response, Request } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { NotFoundError, ForbiddenError } from '../errors/Error';
import { prisma } from '../config/prismaClientConfig';
import { cloudinary } from '../lib/cloudinary';
import { validateSchema } from '../utils/validateSchema';
import {
  deletePhotoSchema,
  eventSchema,
  referencePhotoSchema,
} from '../validations/upload.validation';
import { isThumbnail } from '../utils/isThumbnail';

const getPhotoHandler = asyncHandler(async (req: Request, res: Response) => {
  const eventId = req.eventId as string;

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

const getSingularPhotoHandler = asyncHandler(async (req: Request, res: Response) => {
  const { validatedUserId } = req;
  const { eventId, userId } = validateSchema(referencePhotoSchema, req.query);
  if (validatedUserId !== userId) throw new ForbiddenError(`You can't access it`);
  const photo = await prisma.referenceFace.findUnique({
    where: {
      eventId_userId: {
        eventId: eventId,
        userId: userId,
      },
    },
    select: {
      id: true,
      photo_url: true,
      public_id: true,
      width: true,
      height: true,
      status: true,
    },
  });
  res.status(200).json({
    success: true,
    data: photo,
  });
});
const deletePhotoHandler = asyncHandler(async (req: Request, res: Response) => {
  const { validatedUserId } = req;

  const { photoId, eventId } = validateSchema(deletePhotoSchema, req.query);

  const thumbnailed = await isThumbnail(eventId, photoId);

  if (thumbnailed) throw new ForbiddenError('User doesnot have permission to delete this photo');

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

  const isUploader = dbPhoto.uploaded_by === validatedUserId;
  const isEventOwner = dbPhoto.event?.userId === validatedUserId;
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

const getMyPhotosHandler = asyncHandler(async (req: Request, res: Response) => {
  const { validatedUserId } = req;
  const { eventId, userId } = validateSchema(referencePhotoSchema, req.query);

  if (validatedUserId !== userId) throw new ForbiddenError(`You can't access it`);

  const referenceFace = await prisma.referenceFace.findUnique({
    where: { eventId_userId: { eventId, userId } },
    select: { id: true, status: true },
  });

  if (!referenceFace) throw new NotFoundError('Reference face');
  if (referenceFace.status !== 'DONE') {
    return res.status(202).json({
      success: true,
      message: 'Your reference photo is still processing, please check back shortly',
      data: [],
    });
  }

  const SIMILARITY_THRESHOLD = 0.5;

  const matchedPhotos = await prisma.$queryRaw`
    SELECT DISTINCT p.id, p.photo_url, p.public_id, p.width, p.height, p.uploaded_at
    FROM photo_face pf
    JOIN photo p ON p.id = pf.photo_id
    JOIN reference_face rf ON rf."eventId" = p.event_id
    WHERE rf."eventId" = ${eventId}
      AND rf."userId" = ${userId}
      AND p.event_id = ${eventId}
      AND (1 - (pf.embedding <=> rf.embedding)) > ${SIMILARITY_THRESHOLD}
    ORDER BY p.uploaded_at DESC
  `;

  res.status(200).json({
    success: true,
    data: matchedPhotos,
  });
});

export { getPhotoHandler, deletePhotoHandler, getSingularPhotoHandler, getMyPhotosHandler };
