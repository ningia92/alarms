import fs from 'fs/promises';

const writeFile = async (data: string): Promise<void> => {
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
export const alarmLogger = async (
  roomId: string,
  status: string,
  timestamp: string,
  oldStatus: string | null,
  reason = ''): Promise<void> => {
  const formatDate = new Date(timestamp).toLocaleString('it-IT', { timeZone: 'Europe/Rome' });
  
  let description = '';

  if (status === 'on' && oldStatus === 'on') {
    description = 'Allarme ripetuto';
  } else if (status === 'on') {
    description = 'Allarme attivato';
  } else if (status === 'off') {
    description = (reason === 'Allarme nuovamente raggiungibile') ? reason : `Allarme disattivato: ${reason}`;
  } else if (status === 'down') {
    description = 'Allarme non raggiungibile';
  }

  const log = `${formatDate} [ Camera ${roomId} ] => ${status} (${description})\n`;
  
  await writeFile(log);
}