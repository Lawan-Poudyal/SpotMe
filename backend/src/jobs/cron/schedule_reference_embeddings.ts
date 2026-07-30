import { prisma } from '../../config/prismaClientConfig';
import { referenceEmbeddingQueue } from '../../queues/generate_reference_embeddings.queue';
import cron  from 'node-cron' 

cron.schedule('*/1 * * * * ' , async()=>{
    console.log("CRON JOB INITIATED FOR UPLOAD FACE EMBEDDINGS <=========================>")
    const staleDate = new Date(Date.now() - 1 * 60 * 1000)
    const failed_photos = await prisma.referenceFace.findMany({
	where : {
	    OR : [
		{ status : "PROCESSING" , statusUpdatedAt : {lt : staleDate} },
		{status : "FAILED"}
	    ],
	    retry_count : {lt : 6}
	},
	take : 10,
	include: {
	    event : true
	}
    })
    if(!failed_photos || failed_photos.length ===0) return;
    await Promise.all(
	failed_photos.map((photo)=>{
	    referenceEmbeddingQueue.add("generate_reference_embeddings", {
		eventId : photo.event.id,
		ownerId : photo.userId,
		photoURL : photo.photo_url,
		photoId : photo.id
	    })
	})
    )
} , {
    timezone : 'Asia/Kathmandu'
})

