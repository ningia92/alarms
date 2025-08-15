import { getRedisClient } from '../db/redis-client.js';
import { writeLogs } from '../utils/write-logs.js';

const redisClient = getRedisClient();

export const setAlarmStatus = async (id, status, lastUpdate) => {
  // input validation of the room id
  if (!id.match(/^(\d)+-(\d)+$/g)) {
    const error = new Error('Bad request');
    error.statusCode = 400;
    throw error;
  }

  const roomExists = await redisClient.exists(`room:${id}`);

  if (!roomExists) {
    const error = new Error('Room not found');
    error.statusCode = 404;
    throw error;
  }

  try {
    await redisClient.hSet(`room:${id}:alarm`, { status: `${status}`, lastUpdate: `${lastUpdate}` });
  } catch (err) {
    console.error(`Error while setting alarm status to ${status}`, err);
  }

  // write logs
  const roomType = await redisClient.hGet(`room:${id}`, 'type');
  const formatDate = new Date(lastUpdate).toLocaleString();
  const log = `${formatDate} [ ${roomType === 'room'? 'Room ' + id : 'Pool'} ] => ${status} (${status === 'on' ? 'Alarm activated' : 'Alarm deactivated'})\n`;
  await writeLogs(log);
}