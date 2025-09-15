import { WebSocketServer } from 'ws';

import { setAlarmStatus } from '../services/alarm-service.js';
import { callRoom, checkRoomExists, getRoomList } from '../services/room-service.js';
import { createWebSocketMessage, sendMessageToClient } from './messages.js';

// called by alarms controller when an alarm is activated
export const handleAlarmOn = async (wss: WebSocketServer, roomId: string, timestamp: string) => {
  const existsRoom = await checkRoomExists(roomId);

  if (!existsRoom) {
    console.error('Room ID not found');
    return;
  }

  // make a call to the room phone from which has been activated the alarm
  await callRoom(roomId);

  // set status field of alarm to "on" into redis db
  await setAlarmStatus(roomId, 'on', timestamp);

  const message = createWebSocketMessage('alarm_on', { roomId, timestamp });

  wss.clients.forEach(client => {
    sendMessageToClient(client, message);
  });
}

// called by main wss function when a ws client send the "turn off" alarm message
// called by alarms controller when an alarm is turned off by the alarm device
// called by health check service when an alarm is newly reachable
export const handleAlarmOff = async (wss: WebSocketServer, clientMessage: AlarmOffMessage, timestamp: string) => {
  const { roomId, reason } = clientMessage;

  const existsRoom = await checkRoomExists(roomId);

  if (!existsRoom) {
    console.error('Room ID not found');
    return;
  }

  // set status field of the alarm to "off" into redis db
  // lastDeactivation is used only for logs
  await setAlarmStatus(roomId, 'off', timestamp, reason);

  try {
    const roomList = await getRoomList();

    const message = createWebSocketMessage('room_list', { roomList });

    wss.clients.forEach(client => {
      sendMessageToClient(client, message);
    });
  } catch (err) {
    console.error('Error during handling the off alarm:', err);
  }
}

// called by health check service that is executed periodically
export const handleAlarmDown = async (wss: WebSocketServer, roomId: string, timestamp: string) => {
  await setAlarmStatus(roomId, 'down', timestamp);

  const message = createWebSocketMessage('alarm_down', { roomId });

  wss.clients.forEach(client => {
    sendMessageToClient(client, message);
  });
}