import fs from 'fs/promises';

export const writeLogs = async (log) => {
  try {
    // because the server is launched from top-level directory, the file
    // path needs to start with single dot "./" and not double dot "../"
    fs.writeFile('./logs/alarm-logs.txt', log, { flag: 'a+' });
  } catch (err) {
    console.error('Error during write log', err);
  }
}