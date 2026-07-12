import { prisma } from '../../config/prismaClientConfig';
import { embeddingQueue } from '../../queues/generate_embeddings.queue';
import cron  from 'node-cron' 

cron.schedule('*/5 * * * * ' , async()=>{
    console.log("CRON JOB INITIATED <=========================>")
    const failed_photos = await prisma.photo.findMany({
	where : {
	    status : "FAILED",
	    retry_count : {
		lt : 6
	    }
	},
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

