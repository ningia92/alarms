import { RedisClientType } from 'redis';
import { getRedisClient } from './redis-client.js';

const redisClient: RedisClientType = getRedisClient();

export const getRoomKey = async (roomId: string): Promise<string> => `room:${roomId}`;

export const getRoomKeys = async (): Promise<string[]> => {
  const keyList: string[] = [];

  // scan instad of keys for performance in production
  for await (const keys of redisClient.scanIterator({ MATCH: 'room:*' })) {
    keys.forEach((key: string) => keyList.push(key));
  }

  // regex to filter only the room keys (excluding alarm keys)
  const roomRegex = /^room:(\d){2}-(\d){2}$/g;

  return keyList.filter((key: string) => key.match(roomRegex));
}

export const getRoomData = async (roomKey: string): Promise<Record<string, string>> => {
  return await redisClient.hGetAll(roomKey);
}

export const getPhoneNumber = async (roomId: string): Promise<string | null> => {
  return await redisClient.hGet(await getRoomKey(roomId), 'phone');
}

export const getRoomType = async (roomId: string): Promise<string | null> => {
  return await redisClient.hGet(await getRoomKey(roomId), 'type');
}

// return 1 if exists, 0 if not exists
export const roomExists = async (roomId: string): Promise<number> => {
  return await redisClient.exists(`room:${roomId}`);
}