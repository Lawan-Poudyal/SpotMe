import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { prisma } from '../../config/prismaClientConfig';
import dbErrorHash from '../../utils/dbErrorHash';
import { Job } from 'bullmq';
import { dbErrorType } from '../../utils/dbErrorHash';
import type { requestPayloadSingular } from '../../types/photo.types';
import axios from 'axios';
import { cloudinary } from '../..//lib/cloudinary';
import type { toInjectType } from '../../types/inject.types';
import { redis } from '../../config/redisConfig';
export async function processPhotoJob(job: Job<requestPayloadSingular>) {
  try {
    console.log('processing reference photo');
    const { eventId, ownerId, accessToken, driveFileId , existingPhotoId} = job.data;
    const driveResponse = await axios.get(
      `https://www.googleapis.com/drive/v3/files/${driveFileId}?alt=media`,
      {
        responseType: 'arraybuffer',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    const uploadResult = (await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_chunked_stream(
          { resource_type: 'image', chunk_size: 5000000 },
          (error, uploadResult) => {
            if (error) {
              return reject(error);
            }
            return resolve(uploadResult);
          },
        )
        .end(driveResponse.data);
    })) as toInjectType;
    try {
      await prisma.referenceFace.upsert({
	  where : {
	      eventId_userId : {
		  eventId : eventId,
		  userId : ownerId
	      }
	  },
	  update : {
	      photo_url : uploadResult.secure_url,
	      public_id : uploadResult.public_id
	  },
	  create : {
	    eventId : eventId,
	    photo_url : uploadResult.secure_url,
	    public_id : uploadResult.public_id,
	    userId : ownerId,
	    height : Number(uploadResult.height),
	    width : Number(uploadResult.width)
	  }
      })
      if(existingPhotoId){
	cloudinary.uploader.destroy(existingPhotoId)
	.catch((err) => {
	console.error(`Failed to delete Cloudinary asset ${existingPhotoId}:`, err);
      });
      }

      
    } catch (dbError: unknown) {
      if (dbError instanceof PrismaClientKnownRequestError) {
        const dbErrorCode = dbError.code;
        const dbErrorName: dbErrorType = dbErrorHash[dbErrorCode] as dbErrorType;
        if (dbErrorName === 'ForeignKeyConstraintViolation') {
          console.log(
            'The account or the event has been either deleted by the user or as per community guideline',
          );
          await redis.publish(
            'find_me_image',
            JSON.stringify({ success: false, driveFileId: driveFileId }),
          );
        } else if (dbErrorName === 'UniqueConstraintViolation') {
          console.log("Try using a different name which doesn't already exist in your events");
          await redis.publish(
            'find_me_image',
            JSON.stringify({ userId: ownerId, success: false, driveFileId: driveFileId }),
          );
        } else {
          await redis.publish(
            'find_me_image',
            JSON.stringify({ userId: ownerId, success: false, driveFileId: driveFileId }),
          );
          throw dbError;
        }
      } else {
        await redis.publish(
          'find_me_image',
          JSON.stringify({ userId: ownerId, success: false, driveFileId: driveFileId }),
        );
        throw dbError;
      }
    }
    await redis.publish(
      'find_me_image',
      JSON.stringify({ userId: ownerId, success: true, driveFileId: driveFileId }),
    );
    console.log(`The processing is completed for ${driveFileId}`); 
  } catch (err: unknown) {
    console.log('thrown error');
    if (err instanceof Error) {
      console.log(err.name);
      console.log(err.stack);
      throw err;
    }
  }
}

