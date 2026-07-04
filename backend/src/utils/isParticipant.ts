import { prisma } from '../config/prismaClientConfig';
import { redis } from '../config/redisConfig';

export const isParticipant : (eventId : string , userId : string) => Promise<boolean>= async (eventId : string , userId : string)=>{
    console.log("Yes we are here")
    const cacheKey = `participation-${userId}-${eventId}`
    let hasParticipated = await redis.get(cacheKey) as string | null 

    if (hasParticipated !== null){
	console.log("Cache hit")
	return hasParticipated === '1'
    }
    console.log(`Cache miss`)
    let dbReadParticipation = await prisma.participant.findUnique({
	where : {
	    eventId_userId : {
		eventId : eventId,
		userId : userId
	    }
	},
	select : {
	    id : true
	}
    }) as {id : string} | boolean


    dbReadParticipation = !!dbReadParticipation
    await redis.set( cacheKey, dbReadParticipation ? "1" : "0"  , 'EX' , dbReadParticipation ? 600 : 60)    

    return dbReadParticipation 
}
