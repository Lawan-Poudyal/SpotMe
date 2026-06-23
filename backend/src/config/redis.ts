import IORedis from 'ioredis';

export const connection = new IORedis(process.env.UPSTASH_REDIS_URL!, {
  maxRetriesPerRequest: null,
  tls: {},
});
