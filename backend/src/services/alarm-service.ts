import { getAlarmStatus, updateAlarmStatus } from '../db/alarm-repository.js';
import { alarmLogger } from '../utils/alarm-logger.js';

// store alarm status (on/off/down) in Redis DB and write logs to the alarm-logs.txt file
export const setAlarmStatus = async (
  roomId: string,
  status: AlarmStatus,
  timestamp: string,
  reason?: string): Promise<void> => {
  try {
    // old status of the alarm used for the logs
    const oldStatus = await getAlarmStatus(roomId);

    await updateAlarmStatus(roomId, status, timestamp);

    await alarmLogger(roomId, status, timestamp, oldStatus === 'on', reason);
  } catch (err) {
    console.error(`Error while setting alarm status to ${status}`, err);
  }
}