import fetch from 'node-fetch';

import { getRoomList } from '../services/room-service.js';

// set all the behaviors of the alarm based on how the alarm is activated
// this function is called manually when necessary
const configureAlarms = async () => {
  try {
    const rooms: Room[] = await getRoomList();

    for (const room of rooms) {
      const serverIp = process.env.SERVER_IP ?? '';
      const roomId = room.id;
      const alarmIp = room.alarm.ip;
      const alarmDev = room.alarm.dev;
      const alarmNum = room.alarm.num;

      // URL to configure alarm device
      const configurationUrl = `http://${alarmIp}/settings/${alarmDev}/${alarmNum}`;
      // URLs to change alarm statuses to the server
      const alarmOnUrl = `http://${serverIp}/room/${roomId}/alarm/on`;
      const alarmOffUrl = `http://${serverIp}/room/${roomId}/alarm/off`;

      // different ways to press the alarm:
      // shortpush --> single short press
      // longpush --> long press
      // double_shortpush --> double short press
      // triple_shortpush --> triple short press
      const requests = [
        { param: 'shortpush_url', url: alarmOnUrl },
        { param: 'longpush_url', url: alarmOnUrl },
        { param: 'double_shortpush_url', url: alarmOnUrl },
        { param: 'triple_shortpush_url', url: alarmOffUrl },
      ];

      // execute requests in parallel (more efficient)
      const results = await Promise.all(
        requests.map(async (request) => {
          const fullUrl = `${configurationUrl}?${request.param}=${request.url}`;
          const response = await fetch(fullUrl);

          return response.status;
        })
      )

      const statusOk = results.every(status => status === 200);

      if (statusOk) {
        console.log('Alarm device configuration successful');
      } else {
        console.error('One or more requests were not successful');
      }
    }
  } catch (err) {
    console.error('An error occured during alarms configuration:', err);
  }
}

await configureAlarms();