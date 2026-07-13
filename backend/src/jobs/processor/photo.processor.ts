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
import { embeddingQueue } from '../../queues/generate_embeddings.queue';

export async function processPhotoJob(job: Job<requestPayloadSingular>) {
  try {
    console.log('processing');
    const { eventId, ownerId, accessToken, driveFileId } = job.data;
    let photoURL: string;
    let photoId: string;

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
      [photoURL, photoId] = await prisma.$transaction(async (tx) => {
        let data = await tx.photo.create({
          data: {
            uploaded_by: ownerId,
            event_id: eventId,
            photo_url: uploadResult.secure_url,
            public_id: uploadResult.public_id,
            height: Number(uploadResult.height),
            width: Number(uploadResult.width),
          },
        });
        await tx.event.update({
          where: { id: eventId },
          data: {
            photoCount: { increment: 1 },
          },
        });
        return [data.photo_url, data.id];
      });
    } catch (dbError: unknown) {
      if (dbError instanceof PrismaClientKnownRequestError) {
        const dbErrorCode = dbError.code;
        const dbErrorName: dbErrorType = dbErrorHash[dbErrorCode] as dbErrorType;
        if (dbErrorName === 'ForeignKeyConstraintViolation') {
          console.log(
            'The account or the event has been either deleted by the user or as per community guideline',
          );
          await redis.publish(
            'image_news',
            JSON.stringify({ success: false, driveFileId: driveFileId }),
          );
          throw dbError;
        } else if (dbErrorName === 'UniqueConstraintViolation') {
          console.log("Try using a different name which doesn't already exist in your events");
          await redis.publish(
            'image_news',
            JSON.stringify({ userId: ownerId, success: false, driveFileId: driveFileId }),
          );
          throw dbError;
        } else {
          await redis.publish(
            'image_news',
            JSON.stringify({ userId: ownerId, success: false, driveFileId: driveFileId }),
          );
          throw dbError;
        }
      } else {
        await redis.publish(
          'image_news',
          JSON.stringify({ userId: ownerId, success: false, driveFileId: driveFileId }),
        );
        throw dbError;
      }
    }

    await redis.publish(
      'image_news',
      JSON.stringify({ userId: ownerId, success: true, driveFileId: driveFileId }),
    );

    await embeddingQueue
      .add('generate_embeddings', {
        photoURL: photoURL,
        photoId: photoId,
	eventId : eventId,
      })
      .catch((err) => {
        console.error('Error queuing embedding jobs:', err);
      });

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
