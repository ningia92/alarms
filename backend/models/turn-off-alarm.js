import { getRedisClient } from './redis-client.js';

const redisClient = getRedisClient();

export const turnOffAlarm = async (id) => {
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

  await redisClient.hSet(`room:${id}:alarm`, { status: 'off' });
}