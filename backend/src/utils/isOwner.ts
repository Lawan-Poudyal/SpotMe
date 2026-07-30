import { prisma } from '../config/prismaClientConfig';
import { redis } from '../config/redisConfig';

export const isOwner: (eventId : string , eventName: string, userId: string) => Promise<boolean> = async (
    eventId : string,
    eventName : string,
  userId: string,
) => {
  const cacheKey = `owner-${userId}-${eventId}`;
  let hasOwned = (await redis.get(cacheKey)) as string | null;

  if (hasOwned !== null) {
    return hasOwned === '1';
  }
  let dbReadParticipation = (await prisma.event.findUnique({
    where: {
	eventName_userId :{
	    eventName : eventName,
	    userId : userId
	}
    },
    select: {
      id: true,
    },
  })) as { id: string } | boolean;

  dbReadParticipation = !!dbReadParticipation;
  await redis.set(cacheKey, dbReadParticipation ? '1' : '0', 'EX', dbReadParticipation ? 600 : 60);

  return dbReadParticipation;
};

