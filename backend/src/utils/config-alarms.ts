import fetch from 'node-fetch';

import { getRoom, getRoomList } from '../services/room-service.js';

const getDeviceUrl = async (roomId: string): Promise<string> => {
  const room: Room = await getRoom(roomId);
  const alarmIp = room.alarm.ip;
  const alarmDev = room.alarm.dev;
  const alarmNum = room.alarm.num;

  return `http://${alarmIp}/settings/${alarmDev}/${alarmNum}`;
}

const getRequestList = (roomId: string): {param: string, url: string}[] => {
  const serverIp = process.env.SERVER_IP ?? 'localhost';
  const port = process.env.PORT ?? '3000';

  // URLs to change alarm statuses to the server
  const alarmOnUrl = `http://${serverIp}:${port}/rooms/${roomId}/alarm/on`;
  const alarmOffUrl = `http://${serverIp}:${port}/rooms/${roomId}/alarm/off`;

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

  return requests;
}

const makeRequests = async (
  configurationUrl: string,
  requests: {param: string, url: string}[]): Promise<boolean> => {
  // execute requests in parallel (more efficient)
  const results = await Promise.all(
    requests.map(async (request: {param: string, url: string}) => {
      const fullUrl = `${configurationUrl}?${request.param}=${request.url}`;
      const response = await fetch(fullUrl);
  
      return response.status;
    })
  );
  
  return results.every(status => status === 200);
}

// configure the behaviors of the alarms when they're activated
// it is used when and alarm device goes off or is replaced with an unconfigured one
const configureAlarms = async () => {
  try {
    const rooms: Room[] = await getRoomList();

    for (const room of rooms) {
      const configurationUrl = await getDeviceUrl(room.id);

      const requests = getRequestList(room.id);

      const statusOk = await makeRequests(configurationUrl, requests);

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