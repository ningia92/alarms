import { RedisClientType } from 'redis';
import { getRedisClient } from './redis-client.js';

const redisClient: RedisClientType = getRedisClient();

const getAlarmKey = (roomId: string): string => `room:${roomId}:alarm`;

export const getAlarmStatus = async (roomId: string): Promise<string | null> => {
  return await redisClient.hGet(getAlarmKey(roomId), 'status');
}

export const updateAlarmStatus = async (
  roomId: string,
  status: AlarmStatus,
  timestamp?: string): Promise<void> => {
  const updates: Record<string, string> = { status };

  if (status === 'on' && timestamp) {
    updates.lastActivation = timestamp;
  }

  await redisClient.hSet(getAlarmKey(roomId), updates);
}

export const getAlarmData = async (alarmKey: string): Promise<Record<string, string>> => {
  return await redisClient.hGetAll(alarmKey);
}


