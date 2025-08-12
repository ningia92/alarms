import { createClient } from 'redis';

const redisClient = createClient();

redisClient.on('error', error => console.log('Redis Client Error', error));

await redisClient.connect();

export const getRedisClient = () => redisClient;