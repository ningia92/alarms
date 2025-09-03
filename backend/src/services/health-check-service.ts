import fetch from 'node-fetch';

import { getRoomList } from './room-service.js';
import { handleAlarmDown, handleAlarmOff } from '../websocket/alarm-handler.js';
import { WebSocketServer } from 'ws';

// 30 seconds check interval
const CHECK_INTERVAL = 30000;

// send an HTTP HEAD to the alarm device to check if it's up
// if the device does not respond change its status to down
const isAlarmUp = async (alarm: Alarm) => {
  const { ip, dev, num } = alarm;
  const url = `http://${ip}/${dev}/${num}`;

  try {
    const response = await fetch(url, {
      method: 'HEAD',
      signal: AbortSignal.timeout(2000) // 2 seconds timeout to prevent fetch requests from remaining pending
    });

    return response.ok;
  } catch (err) {
    console.error(`Alarm device with IP ${ip} is unreachable:`, err);
  }
}

const deviceHealthChecks = async (wss: WebSocketServer) => {
  try {
    const rooms = await getRoomList();

    for (const room of rooms) {
      const { id: roomId, alarm } = room;

      const isUp = await isAlarmUp(alarm);

      const timestamp = new Date().toISOString();
      if (!isUp) {
        await handleAlarmDown(wss, roomId, timestamp);
      } else {
        const message: AlarmOffMessage = {
          type: 'alarm_off',
          roomId,
          reason: 'Allarme nuovamente raggiungibile'
        };
        const timestamp = new Date().toISOString();

        await handleAlarmOff(wss, message, timestamp);
      }
    }
  } catch (err) {
    console.error('Device health check failed:', err);
  }
}

// start periodic checks
export const startPeriodicDeviceChecks = (wss: WebSocketServer) => {
  console.log('Periodic checks of alarm devices...');

  setInterval(() => {
    void deviceHealthChecks(wss);
  }, CHECK_INTERVAL);
}