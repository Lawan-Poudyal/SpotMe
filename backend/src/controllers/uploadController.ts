import type { Response, Request } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { cloudinary } from '../lib/cloudinary';
import { NotFoundError, UnauthorizedError } from '../errors/Error';
import { prisma } from '../config/prismaClientConfig';
import { getSession } from '../utils/getSessions';
import { eventSchema, saveUploadSchema } from '../validations/upload.validation';
import { validateSchema } from '../utils/validateSchema';

const signedUploadRequest = asyncHandler(async (req: Request, res: Response) => {
  const timestamp = Math.floor(Date.now() / 1000);
  const { eventId } = validateSchema(eventSchema, req.body);
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
  const {validatedUserId} = req
  const { eventId, photos } = validateSchema(saveUploadSchema, req.body);
  const event = await prisma.event.findUnique({ where: { id: eventId } });
  if (!event) throw new NotFoundError(`Event with id "${eventId}" not found`);

  const saved = await prisma.photo.createMany({
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
});

export { signedUploadRequest, saveUploadRequest };
