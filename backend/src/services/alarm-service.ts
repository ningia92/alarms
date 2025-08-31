import { getRedisClient } from '../db/redis-client.js';
import { alarmLogger } from '../utils/alarm-logger.js';

const redisClient = getRedisClient();

// function that writes data on Redis db and writes logs on .txt file
export const setAlarmStatus = async (roomId: string, status: string, timestamp: string, reason = '') => {
  // input validation of the room id
  const roomIdRegex = /^(\d)+-(\d)+$/g;
  if (!roomId.match(roomIdRegex)) {
    const error = new Error('Bad request');
    error.statusCode = 400;
    throw error;
  }

  const roomExists = await redisClient.exists(`room:${roomId}`);

  if (!roomExists) {
    const error = new Error('Room not found');
    error.statusCode = 404;
    throw error;
  }

  // old status of the alarm used for the logs
  const oldStatus = await redisClient.hGet(`room:${roomId}:alarm`, 'status');

  // if status is on, set lastActivation of the alarm to timestamp
  try {
    if (status === 'on') {
      await redisClient.hSet(`room:${roomId}:alarm`, { status: status, lastActivation: timestamp });
    } else {
      await redisClient.hSet(`room:${roomId}:alarm`, { status: status });
    }
  } catch (err) {
    console.error(`Error while setting alarm status to ${status}`, err);
  }

  await alarmLogger(roomId, oldStatus ?? '', status, reason, timestamp);
}