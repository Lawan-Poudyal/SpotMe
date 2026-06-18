import { createClient } from 'redis';

const client = createClient({
  username: 'default',
  password: String(process.env.REDIS_PASSWORD),
  socket: {
    host: 'redis-14584.crce263.ap-south-1-1.ec2.cloud.redislabs.com',
    port: 14584,
  },
});

client.on('error', (err) => console.log('Redis Client Error', err));

export { client as redisClient };
