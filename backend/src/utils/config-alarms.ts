import fetch from 'node-fetch';
import readline from 'node:readline';

import { getRoom, getRoomList } from '../services/room-service.js';

const getDeviceUrl = async (roomId: string): Promise<string> => {
  const room: Room = await getRoom(roomId);
  const alarmIp = room.alarm.ip;
  const alarmDev = room.alarm.dev;
  const alarmNum = room.alarm.num;

  return `http://${alarmIp}/settings/${alarmDev}/${alarmNum}`;
}

const getRequestList = (roomId: string): {param: string, url: string}[] => {
  const serverIp = process.env.SERVER_IP ?? '';

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

// configure the behaviors of the alarm based on how the alarm is activated
// it is used when and alarm device goes off or is replaced with an unconfigured one
const configureAlarm = async (roomId: string) => {
  try {
    // URL to configure alarm device
    const configurationUrl = await getDeviceUrl(roomId);

    const requests = getRequestList(roomId);

    const statusOk = await makeRequests(configurationUrl, requests);

    if (statusOk) {
      console.log('Alarm device configuration successful');
    } else {
      console.error('One or more requests were not successful');
    }

  } catch (err) {
    console.error('An error occured during alarm configuration:', err);
  }
}

// configura all the alarms
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

const startConfiguration = async () => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question('Scegli il tipo di configurazione: (1) configurazione singolo allarme - (2) configurazione di tutti gli allarmi', configurationType => {

    if (configurationType === '1') {
      rl.question(`Digita l'ID della camera:`, roomId => {
        configureAlarm(roomId);
      })

      rl.close();
    }

    if (configurationType === '2') {
      configureAlarms();
    }

    rl.close();
  })
}

startConfiguration();