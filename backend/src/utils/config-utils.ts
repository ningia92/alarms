import fetch from 'node-fetch';

import { getRoom } from '../services/room-service.js';

export const getDeviceUrl = async (roomId: string): Promise<string> => {
  const room: Room = await getRoom(roomId);
  const alarmIp = room.alarm.ip;
  const alarmDev = room.alarm.dev;
  const alarmNum = room.alarm.num;

  return `http://${alarmIp}/settings/${alarmDev}/${alarmNum}`;
}

export const getRequestList = (roomId: string): {param: string, url: string}[] => {
  const serverIp = process.env.SERVER_IP ?? 'localhost';
  const port = process.env.PORT ?? '3000';

  // URLs used to change alarm status (on/off)
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

export const makeRequests = async (
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