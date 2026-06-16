import type { Response, Request } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { auth } from '../config/auth';
import { cloudinary } from '../lib/cloudinary';
import { ValidationError } from '../errors/Error';

const signedUploadRequest = asyncHandler(async (req: Request, res: Response) => {
  const timestamp = Math.floor(Date.now() / 1000);

  const session = await auth.api.getSession({
    headers: req.headers as HeadersInit,
  });
  if (!session) throw new ValidationError('User must be authenticated to upload files');

  const eventId = req.body.eventId;
  if (!eventId || typeof eventId !== 'string') {
    throw new ValidationError('Missing or invalid eventId in the request body');
  }

  const params = { timestamp, eventId, userId: session.user.id };
  const signature = cloudinary.utils.api_sign_request(params, process.env.CLOUDINARY_SECRET!);

  res.status(200).json({
    success: true,
    data: {
      signature,
      timestamp,
      apiKey: process.env.CLOUDINARY_API_KEY!,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME!,
    },
  });
});

export { signedUploadRequest };
