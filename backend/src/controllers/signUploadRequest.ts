import type { Response, Request } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { auth } from '../config/auth';
import { cloudinary } from '../lib/cloudinary';

const signedUploadRequest = asyncHandler(async (req: Request, res: Response) => {
  const timeStamp = Math.floor(Date.now() / 1000);
  const session = await auth.api.getSession({
    headers: req.headers as HeadersInit,
  });

  const params = { timeStamp, eventId: req.body.eventId, userId: session?.user.id };
  const signature = cloudinary.utils.api_sign_request(params, process.env.CLOUDINARY_SECRET!);

  res.status(200).json({
    success: true,
    data: {
      signature,
      timeStamp,
    },
  });
});
