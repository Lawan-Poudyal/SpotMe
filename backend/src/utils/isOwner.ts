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
	id : eventId
    },
    select: {
      userId : true
    },
  })) as { id: string , userId : string } 

  let hasOwnership = dbReadParticipation?.userId
  await redis.set(cacheKey, hasOwnership ? '1' : '0', 'EX', dbReadParticipation ? 600 : 60);

  return !!hasOwnership;
};

