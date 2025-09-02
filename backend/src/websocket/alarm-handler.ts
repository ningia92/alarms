import { WebSocketServer } from 'ws';

import { setAlarmStatus } from '../services/alarm-service.js';
import { callRoom, getRoomList } from '../services/room-service.js';

// called by health check service that is executed periodically
export const handleAlarmDown = async (wss: WebSocketServer, roomId: string, timestamp: string) => {
  if (!roomId) {
    console.error('Missing room id');
    return;
  }

  await setAlarmStatus(roomId, 'down', timestamp);

  const message: AlarmDownMessage = {
    type: 'alarm_down',
    roomId,
    status: 'down'
  };

  const strMessage = JSON.stringify(message);

  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      try {
        client.send(strMessage);
      } catch (err) {
        console.error('Error while sending web socket message to clients', err);
        client.send(JSON.stringify({
          type: 'error',
          info: 'Unable to retrieve alarm status'
        }));
      }
    }
  })
}

// called by alarms controller when an alarm is activated
export const handleAlarmOn = async (wss: WebSocketServer, roomId: string, timestamp: string) => {
  if (!roomId) {
    console.error('Missing room id');
    return;
  }

  // if the alarm is not coming from the pool (00-00)
  // make a call to the room phone that activated the alarm
  if (roomId !== '00-00') await callRoom(roomId);

  // set status field of alarm to "on" into redis db
  await setAlarmStatus(roomId, 'on', timestamp);

  const message: AlarmOnMessage = {
    type: 'alarm_on',
    roomId,
    status: 'on',
    lastActivation: timestamp
  };

  const strMessage = JSON.stringify(message);

  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      try {
        client.send(strMessage);
      } catch (err) {
        console.error('Error while sending web socket message to clients', err);
        client.send(JSON.stringify({
          type: 'error',
          info: 'Unable to retrieve alarm status'
        }));
      }
    }
  })
}

// called by main wss function when a ws client send the "turn off" alarm message
// called by alarms controller when an alarm is turned off by the alarm device
// called by health check service when an alarm is newly reachable
export const handleAlarmOff = async (wss: WebSocketServer, message: AlarmOffMessage) => {
  const { roomId, reason } = message;
  const timestamp = new Date().toISOString();

  if (!roomId) {
    console.error('Missing room id');
    return;
  }

  // set status field of the alarm to "off" into redis db
  // lastDeactivation is used only for logs
  await setAlarmStatus(roomId, 'off', timestamp, reason);

  for (const client of wss.clients) {
    if (client.readyState === WebSocket.OPEN) {
      try {
        const roomList = await getRoomList();
        client.send(JSON.stringify({ type: 'room_list', rooms: roomList }));
      } catch (err) {
        console.error('Error while sending web socket message to clients', err);
        client.send(JSON.stringify({
          type: 'error',
          info: 'Unable to retrieve room list'
        }));
      }
    }

  }
}