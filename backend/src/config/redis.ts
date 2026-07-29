const redisUrl = process.env.UPSTASH_REDIS_HOST;
const redisPassword = process.env.UPSTASH_REDIS_PASSWORD || undefined;

export const connection = {
  host: redisUrl,
  port: 6379,
  password: redisPassword,
  // tls : {}
};
