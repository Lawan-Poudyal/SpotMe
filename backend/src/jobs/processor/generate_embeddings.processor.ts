import { prisma } from '../../config/prismaClientConfig';
import { Job } from 'bullmq';
import type { embeddingPaylod } from '../../types/generateEmbeddingsType';
import { redis } from '../../config/redisConfig';
import  {generateEmbeddings} from "../../lib/faceService";
import {randomUUID} from 'crypto';

export async function generatedEmbedding(job: Job<embeddingPaylod>) {
  const {photoURL , photoId , eventId} = job.data
  try {

    console.log("Generating the embeddings")

    await prisma.photo.update({
	    where : {id : photoId},
	    data : {
	      status : "PROCESSING",
	      statusUpdatedAt : new Date(),
	      retry_count : {increment : 1}
      }
    });

    const result = await generateEmbeddings(photoId, photoURL);

    if (result.status === 'error'){
      throw new Error(result.error || 'face_service_error');
    }

    await prisma.$transaction(async (tx) =>{
      for (const face of result.faces) {
        await tx.$executeRaw`
          INSERT INTO "photo_face" ("id", "photo_id", "face_index", "embedding", "bbox", "det_score")
          VALUES (
            ${randomUUID()},
            ${photoId},
            ${face.face_index},
            ${JSON.stringify(face.embedding)}::vector,
            ${JSON.stringify(face.bbox)}::jsonb,
            ${face.det_score}
            )
        `;
      }

      await tx.photo.update({
        where: { id: photoId},
        data: {status: 'DONE', statusUpdatedAt: new Date()},
      });
    });

    await redis.publish(
    'embedding_news',
    JSON.stringify({ success: true, photoId, eventId, facesFound: result.faces.length}),
    );

    console.log(`embeddings generated for ${photoId}: ${result.faces.length} face(s)`);
  } catch (err: unknown) {
    await prisma.photo.update({
      where: { id: photoId },
      data: { status: 'FAILED', statusUpdatedAt: new Date() },
    });
    await redis.publish(
      'embedding_news',
      JSON.stringify({ success: false, photoId, eventId }),
    );
    console.log('thrown error from embedding generation queue');
    if (err instanceof Error) {
      console.log(err.name);
      console.log(err.stack);
      throw err;
    }
  }
}
