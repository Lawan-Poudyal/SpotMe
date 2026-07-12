import { prisma } from '../../config/prismaClientConfig';
import { Job } from 'bullmq';
import type { embeddingPaylod } from '../../types/generateEmbeddingsType';
import { redis } from '../../config/redisConfig';
import  {generateEmbeddings} from '../../utils/mockEmbeddingGeneration' 
export async function generatedEmbedding(job: Job<embeddingPaylod>) {
  const {photoURL , photoId , eventId} = job.data
  try {

      console.log("Generating the embeddings")

      let claimPhoto = await prisma.photo.update({
	  where : {id : photoId},
	  data : {
	      status : "PROCESSING"
	  }
      })
      const generatedEmbeddings = await generateEmbeddings(photoId , photoURL)
      await prisma.$executeRaw` UPDATE "photo"
	  SET "status" = 'DONE', "embedding" = ${generatedEmbeddings}::vector
	  WHERE "id" = ${photoId}`
      await redis.publish(
	'embedding_news',
	JSON.stringify({ success: true, photoId : photoId , eventId}),
      );

      console.log(`embeddings generated for ${photoId}`)
	
  } catch (err: unknown) {
    await prisma.photo.update({
	where : {id : photoId},
	data : {
	    status : "FAILED",
	    retry_count : {increment : 1}
	}
    })
  await redis.publish(
    'embedding_news',
    JSON.stringify({ success: false, photoId : photoId, eventId}),
  );
    console.log('thrown error from embedding generation queue ');
    if (err instanceof Error) {
      console.log(err.name);
      console.log(err.stack);
      throw err;
    }
  }
}
