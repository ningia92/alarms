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
export const alarmLogger = async (id: string, status: string, timestamp: string, isOn = false, reason = '') => {
  const roomType = await redisClient.hGet(`room:${id}`, 'type');
  const formatDate = new Date(timestamp).toLocaleString();
  let description = '';

  if (status === 'on' && isOn) {
    description = 'Allarme ripetuto';
  } else if (status === 'on') {
    description = roomType === 'pool'
      ? 'Allarme attivato - Livello acqua troppo alto'
      : 'Allarme attivato';
  } else if (status === 'off') {
    description = roomType === 'pool'
      ? 'Allarme disattivato - Livello acqua nella norma'
      : `Allarme disattivato: ${reason}`;
  } else if (status === 'down') {
    description = 'Dispositivo non raggiungibile';
  }

  const log = `${formatDate} [ ${roomType === 'room' ? 'Camera ' + id : 'Piscina'} ] => ${status} (${description})\n`;
  await writeFile(log);
}