import { getRedisClient } from '../db/redis-client.js';

const redisClient = getRedisClient();

export const setAlarmToOff = async (id) => {
  // input validation of the room id
  if (!id.match(/^(\d)+-(\d)+$/g)) {
    const error = new Error('Bad request');
    error.statusCode = 400;
    throw error;
  }

  const room = await redisClient.exists(`room:${id}`);

  if (!room) {
    const error = new Error('Room not found');
    error.statusCode = 404;
    throw error;
  }

  try {
    await redisClient.hSet(`room:${id}:alarm`, { status: 'off' });
  } catch (err) {
    console.error('Error while setting alarm status to off', err);
  }
}

export const setAlarmToOn = async (id) => {
  const room = await redisClient.exists(`room:${id}`);

  if (!room) {
    const error = new Error('Room not found');
    error.statusCode = 404;
    throw error;
  }

  try {
    await redisClient.hSet(`room:${id}:alarm`, { status: 'on' });
  } catch (err) {
    console.error('Error while setting alarm status to on', err);
  }
}