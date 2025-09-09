import fs from 'fs/promises';

import { getRoomType } from '../db/room-repository.js';

const writeFile = async (data: string) => {
  try {
    // because the server is launched from top-level directory, the file
    // path needs to start with single dot "./" and not with double dot "../"
    // await fs.writeFile('./logs/alarm-logs.txt', data, { flag: 'a+' });
    await fs.writeFile('logs/alarm-logs.txt', data, { flag: 'a+' });
  } catch (err) {
    console.error('Error while writing logs:', err);
  }
}

// write logs
export const alarmLogger = async (roomId: string, status: string, timestamp: string, isOn = false, reason = '') => {
  const roomType = await getRoomType(roomId);

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
      : (reason === 'Allarme nuovamente raggiungibile') ? reason : `Allarme disattivato: ${reason}`;
  } else if (status === 'down') {
    description = 'Allarme non raggiungibile';
  }

  const log = `${formatDate} [ ${roomType === 'room' ? 'Camera ' + roomId : 'Piscina'} ] => ${status} (${description})\n`;
  
  await writeFile(log);
}