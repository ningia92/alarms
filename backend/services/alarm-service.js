import { getRedisClient } from '../db/redis-client.js';
import { writeLogs } from '../utils/write-logs.js';

const redisClient = getRedisClient();

// function that writes data on Redis db and writes logs on .txt file
export const setAlarmStatus = async (id, status, lastStatusChange) => {
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

  // if status is on, set lastActivation of the alarm to lastStatusChange
  try {
    if (status === 'on') {
      await redisClient.hSet(`room:${id}:alarm`,
        {
          status: `${status}`,
          lastActivation: `${lastStatusChange}`
        });
    } else {
      await redisClient.hSet(`room:${id}:alarm`, { status: `${status}` });
    }
  } catch (err) {
    console.error(`Error while setting alarm status to ${status}`, err);
  }

  // write logs for activation/deactivation of the alarms
  const roomType = await redisClient.hGet(`room:${id}`, 'type');
  const formatDate = new Date(lastStatusChange).toLocaleString();
  const log = `${formatDate} [ ${roomType === 'room' ? 'Room ' + id : 'Pool'} ] => ${status} (${status === 'on' ? 'Alarm activated' : 'Alarm deactivated'})\n`;
  await writeLogs(log);
}