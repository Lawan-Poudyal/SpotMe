import type { Response, Request } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { cloudinary } from '../lib/cloudinary';
import { NotFoundError, UnauthorizedError, ValidationError } from '../errors/Error';
import { prisma } from '../config/prismaClientConfig';
import { getSession } from '../utils/getSessions';

const signedUploadRequest = asyncHandler(async (req: Request, res: Response) => {
  const timestamp = Math.floor(Date.now() / 1000);

  const session = await getSession(req.headers as HeadersInit);

  if (!session) throw new UnauthorizedError('User must be authenticated to upload files');

  const eventId = req.body.eventId;
  if (!eventId || typeof eventId !== 'string') {
    throw new ValidationError('Missing or invalid eventId in the request body');
  }

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
  const { eventId, photos } = req.body;

  if (!eventId) throw new ValidationError('Missing or invalid eventId in the request body');
  if (!photos || !Array.isArray(photos))
    throw new ValidationError('Missing or invalid photos array in the request body');

  const session = await getSession(req.headers as HeadersInit);
  const event = await prisma.event.findUnique({ where: { id: eventId } });

  if (!session) throw new UnauthorizedError('User must be authenticated to upload files');
  if (!event) throw new NotFoundError(`Event with id "${eventId}" not found`);

  const saved = await prisma.photo.createMany({
    data: photos.map((p) => ({
      event_id: eventId,
      uploaded_by: session.user.id,
      photo_url: p.url,
      public_id: p.publicId,
      width: p.width,
      height: p.height,
    })),
  });
  res.status(201).json({ success: true, data: saved });
});

export { signedUploadRequest, saveUploadRequest };
