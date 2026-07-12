import type { Response, Request } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { NotFoundError, ForbiddenError } from '../errors/Error';
import { prisma } from '../config/prismaClientConfig';
import { cloudinary } from '../lib/cloudinary';
import { validateSchema } from '../utils/validateSchema';
import { deletePhotoSchema, eventSchema , referencePhotoSchema} from '../validations/upload.validation';
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
  const {validatedUserId} = req
  const { eventId  , userId} = validateSchema(referencePhotoSchema, req.query);
  if(validatedUserId !== userId) throw new ForbiddenError(`You can't access it`)
  const photo = await prisma.referenceFace.findUnique({
    where: {
	eventId_userId : {
	    eventId:eventId,
	    userId : userId
	}
    },
    select: {
	id  :true,
	photo_url : true,
	public_id : true,
	width : true,
	height : true
    },
  });
    console.log(photo)
  res.status(200).json({
    success: true,
    data: photo,
  });
});
const deletePhotoHandler = asyncHandler(async (req: Request, res: Response) => {
  const {validatedUserId} = req

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

export { getPhotoHandler, deletePhotoHandler , getSingularPhotoHandler};
