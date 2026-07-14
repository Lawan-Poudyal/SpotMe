import type { Response, Request } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { cloudinary } from '../lib/cloudinary';
import { ForbiddenError, NotFoundError, UnauthorizedError } from '../errors/Error';
import { prisma } from '../config/prismaClientConfig';
import {
  eventSchema,
  saveUploadSchema,
  saveUploadSingularSchema,
} from '../validations/upload.validation';
import { embeddingQueue } from '../queues/generate_embeddings.queue';
import { validateSchema } from '../utils/validateSchema';
import { referenceEmbeddingQueue } from '../queues/generate_reference_embeddings.queue';

const signedUploadRequest = asyncHandler(async (req: Request, res: Response) => {
  const timestamp = Math.floor(Date.now() / 1000);
  const eventId = req.eventId;
  const folderName = `SpotMe/events/${eventId}/photos`;
  const params = { timestamp, folder: folderName };
  const signature = cloudinary.utils.api_sign_request(params, process.env.CLOUDINARY_API_SECRET!);

  res.status(200).json({
    success: true,
    data: {
      signature,
      timestamp,
      folder: folderName,
      apiKey: process.env.CLOUDINARY_API_KEY!,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME!,
    },
  });
});

const saveUploadRequest = asyncHandler(async (req: Request, res: Response) => {
  const { validatedUserId } = req;
  const { eventId, photos } = validateSchema(saveUploadSchema, req.body);
  const event = await prisma.event.findUnique({ where: { id: eventId } });
  if (!event) throw new NotFoundError(`Event with id "${eventId}" not found`);

  const saved = await prisma.photo.createManyAndReturn({
    data: photos.map((p) => ({
      event_id: eventId,
      uploaded_by: validatedUserId,
      photo_url: p.url,
      public_id: p.publicId,
      width: p.width,
      height: p.height,
    })),
  });

  res.status(201).json({ success: true, data: saved });

  await prisma.event
    .update({
      where: { id: eventId },
      data: { photoCount: { increment: photos.length } },
    })
    .catch((err) => {
      console.error('Error in post-update cleanup:', err);
    });

  await Promise.all(
    saved.map((photo) =>
      embeddingQueue.add('generate_embedding', {
        photoId: photo.id,
        photoURL: photo.photo_url,
        eventId: eventId,
      }),
    ),
  ).catch((err) => {
    console.error('Error queuing embedding jobs:', err);
  });
});

const saveUploadRequestSingular = asyncHandler(async (req: Request, res: Response) => {
  const { validatedUserId } = req;
  console.log('FROM The DEPTH OF HELL');
  console.log(req.body.existingPhotoId);
  const { userId, eventId, photo, existingPhotoId } = validateSchema(
    saveUploadSingularSchema,
    req.body,
  );
  if (userId !== validatedUserId) throw new ForbiddenError('You are forbidden');
  const event = await prisma.event.findUnique({ where: { id: eventId } });
  if (!event) throw new NotFoundError(`Event with id "${eventId}" not found`);

  const saved = await prisma.referenceFace.upsert({
    where: {
      eventId_userId: {
        eventId: eventId,
        userId: userId,
      },
    },
    update: {
      photo_url: photo.url,
      public_id: photo.publicId,
    },
    create: {
      photo_url: photo.url,
      eventId: eventId,
      public_id: photo.publicId,
      width: photo.width,
      height: photo.height,
      userId: userId,
    },
  });

  if (!existingPhotoId) {
    cloudinary.uploader.destroy(existingPhotoId).catch((err) => {
      console.error('Problem deleting the image');
    });
  }

  await referenceEmbeddingQueue
    .add('generate_reference_embeddings', {
      photoId: saved.id,
      photoURL: saved.photo_url,
      eventId: saved.eventId,
      ownerId: saved.userId,
    })
    .catch((err) => {
      console.error(`The error is ${err}`);
    });

  res.status(201).json({ success: true, data: saved });
});
export { signedUploadRequest, saveUploadRequest, saveUploadRequestSingular };
