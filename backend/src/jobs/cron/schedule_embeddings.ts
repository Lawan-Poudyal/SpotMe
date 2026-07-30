import { prisma } from '../../config/prismaClientConfig';
import { embeddingQueue } from '../../queues/generate_embeddings.queue';
import cron  from 'node-cron' 

cron.schedule('*/1 * * * * ' , async()=>{
    console.log("CRON JOB INITIATED FOR UPLOAD EMBEDDINGS <=========================>")
    const staleDate = new Date(Date.now() - 1 * 60 * 1000)
    const failed_photos = await prisma.photo.findMany({
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
	    embeddingQueue.add("generate_embeddings", {
		eventId : photo.event.id,
		photoURL : photo.photo_url,
		photoId : photo.id
	    })
	})
    )
} , {
    timezone : 'Asia/Kathmandu'
})

