import { createClient, RedisClientType } from 'redis';

const host: string = process.env.REDIS_HOST ?? 'localhost';
const port: string = process.env.REDIS_PORT ?? '6379';

console.log(host);
const redisClient: RedisClientType = createClient({
  url: `redis://${host}:${port}`
});

redisClient.on('error', error => {
  console.log('Redis connection error', error);
});

await redisClient.connect();

export const getRedisClient = () => redisClient;