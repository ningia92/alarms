import fs from 'fs/promises';

import { getRedisClient } from '../db/redis-client.js';

const redisClient = getRedisClient();

const writeFile = async (data: string) => {
  try {
    // because the server is launched from top-level directory, the file
    // path needs to start with single dot "./" and not double dot "../"
    await fs.writeFile('./logs/alarm-logs.txt', data, { flag: 'a+' });
  } catch (err) {
    console.error('Error during write logs', err);
  }
}

// function that handles writing of logs
export const alarmLogger = async (id: string, oldStatus: string, status: string, timestamp: string) => {
  const roomType = await redisClient.hGet(`room:${id}`, 'type');
  const formatDate = new Date(timestamp).toLocaleString();
  let description = '';

  if (status === 'on' && oldStatus === 'on') {
    description = 'Alarm activation repeated';
  } else if (status === 'on') {
    description = 'Alarm activated';
  } else if (status === 'off') {
    description = 'Alarm deactivated';
  }

  const log = `${formatDate} [ ${roomType === 'room' ? 'Room ' + id : 'Pool'} ] => ${status} (${description})\n`;
  await writeFile(log);
}