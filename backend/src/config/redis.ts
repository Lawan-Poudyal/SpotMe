const redisUrl = process.env.UPSTASH_REDIS_HOST;
const redisPassword = process.env.UPSTASH_REDIS_PASSWORD;

export const connection = {
    host : redisUrl,
    port : 6379,
    password : redisPassword,
    tls : {}
}
