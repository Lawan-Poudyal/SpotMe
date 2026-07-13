import Redis from 'ioredis'

const redisURL = process.env.REDIS_URL
if(!redisURL){
    throw new Error("Redis URL value undefined")
}
export const redisPubSubClient = new Redis(redisURL)



