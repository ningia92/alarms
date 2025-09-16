import fetch from 'node-fetch';

import { getRoom } from '../services/room-service.js';

// The shelly i3 has 3 indipendent input channels which can operate with all types of toggle and
// momentary AC switches.
// Shelly i3 can detect and announce not only simple ON/OFF state changes, but also complex (multipush) input events,
// for example double shortpush, shortpush + longpush, etc. For each of this events Shelly i3 can invoke 
// user-configurable action URLs.
// For more information see https://shelly-api-docs.shelly.cloud/gen1/?shell#shelly-i3-input-events

// return the url used to configure alarm device
export const getDeviceUrl = async (roomId: string): Promise<string> => {
  const room: Room = await getRoom(roomId);
  const alarmIp = room.alarm.ip;
  const inputChannel = room.alarm.inputChannel;

  return `http://${alarmIp}/settings/input/${inputChannel}`;
}

// return the list of configuratiob params 
export const getParamsList = (roomId: string): { param: string, url: string }[] => {
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
  requests: { param: string, url: string }[]): Promise<boolean> => {
  // execute requests in parallel (more efficient)
  const results = await Promise.all(
    requests.map(async (request: { param: string, url: string }) => {
      const fullUrl = `${configurationUrl}?${request.param}=${request.url}`;
      const response = await fetch(fullUrl);

      return response.status;
    })
  );

  return results.every(status => status === 200);
}