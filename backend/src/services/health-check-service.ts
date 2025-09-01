import fetch from 'node-fetch';

import { getRedisClient } from '../db/redis-client.js';
import { getRoomList } from './room-service.js';
import { alarmLogger } from '../utils/alarm-logger.js';

const redisClient = getRedisClient();

// 1 minute check interval
const CHECK_INTERVAL = 6000;

// send an HTTP HEAD to the alarm device to check if it's up
// if the device does not respond change its status to down
const isAlarmUp = async (alarm: Alarm) => {
  const { ip, dev, num } = alarm;
  const url = `http://${ip}/${dev}/${num}`;

  try {
    const response = await fetch(url, {
      method: 'HEAD',
      /////////// timeout (?)
    });

    return response.ok;
  } catch (err) {
    console.error(`Alarm device with IP ${ip} is unreachable:`, err);
    return false;
  }
} 

const deviceHealthChecks = async () => {
  try {
    const rooms = await getRoomList();
    const devices = rooms.map(room => {
      return {
        roomId: room.id,
        alarm: room.alarm
      }
    });

    for (const device of devices) {
      const isUp = await isAlarmUp(device.alarm);

      if (!isUp) {
        const timestamp = new Date().toISOString();
        const status = 'down';

        await redisClient.hSet(`room:${device.roomId}:alarm`, { status });

        await alarmLogger(device.roomId, status, timestamp);
      }
    }
  } catch (err) {
    console.error('Device health check failed:', err);
  }
}

// start periodic checks
export const startPeriodicDeviceChecks = () => {
  console.log('Start of periodic checks of alarm devices...');

  setInterval(() => {
    void deviceHealthChecks();
  }, CHECK_INTERVAL);
}