import { prisma } from '../config/prismaClientConfig';
import { redis } from '../config/redisConfig';

export const isThumbnail : (eventId : string , photoId : string) => Promise<boolean> = async (eventId : string , photoId : string) =>{
    const cacheKey = `thumbnail-${eventId}` 
    const cachedThumbnailId = await redis.get(cacheKey)
    if(!!cachedThumbnailId){
	console.log("Cache hit")
	return cachedThumbnailId === photoId
    }
    console.log("Cache miss")

    const eventThumbnail = await prisma.photo.findUnique({
	where : {
	    id : photoId
	},
	select : {
	    event : {
		select : {
		    thumbnailId : true
		}
	    }
	}
    })

    await redis.set(cacheKey , eventThumbnail?.event.thumbnailId as string, 'EX', 600 )
    console.log('From the thing ' , eventThumbnail?.event.thumbnailId === photoId)
    return eventThumbnail?.event.thumbnailId === photoId
}
