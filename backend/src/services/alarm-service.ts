import { getRedisClient } from '../db/redis-client.js';
import { alarmLogger } from '../utils/alarm-logger.js';

const redisClient = getRedisClient();

// store alarm status (on/off/down) in Redis DB and write logs to the alarm-logs.txt file
export const setAlarmStatus = async (roomId: string, status: string, timestamp: string, reason?: string) => {
  // old status of the alarm used for the logs
  const oldStatus = await redisClient.hGet(`room:${roomId}:alarm`, 'status');

  try {
    switch (status) {
      case 'on':
        // set lastActivation of the alarm to timestamp
        await redisClient.hSet(`room:${roomId}:alarm`, { status, lastActivation: timestamp });
        break;
      case 'off':
        await redisClient.hSet(`room:${roomId}:alarm`, { status });
        break;
      case 'down':
        await redisClient.hSet(`room:${roomId}:alarm`, { status })
        break;
    }
  } catch (err) {
    console.error(`Error while setting alarm status to ${status}`, err);
  }

  await alarmLogger(roomId, status, timestamp, oldStatus === 'on', reason);
}