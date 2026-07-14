import { prisma } from '../config/prismaClientConfig';
import { redis } from '../config/redisConfig';

export const isParticipant: (eventId: string, userId: string) => Promise<boolean> = async (
  eventId: string,
  userId: string,
) => {
  const cacheKey = `participation-${userId}-${eventId}`;
  let hasParticipated = (await redis.get(cacheKey)) as string | null;

  if (hasParticipated !== null) {
    return hasParticipated === '1';
  }
  let dbReadParticipation = (await prisma.participant.findUnique({
    where: {
      eventId_userId: {
        eventId: eventId,
        userId: userId,
      },
    },
    select: {
      id: true,
    },
  })) as { id: string } | boolean;

  dbReadParticipation = !!dbReadParticipation;
  await redis.set(cacheKey, dbReadParticipation ? '1' : '0', 'EX', dbReadParticipation ? 600 : 60);

  return dbReadParticipation;
};
