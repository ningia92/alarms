import { createClient, RedisClientType } from 'redis';

const redisClient: RedisClientType = createClient();

redisClient.on('error', error => {
  console.log('Redis connection error', error);
});

await redisClient.connect();

export const getRedisClient = () => redisClient;