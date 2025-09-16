import { WebSocketServer } from 'ws';

import { callRoom, checkRoomExists, getRoomList } from '../services/room-service.js';
import { createWebSocketMessage, sendMessageToClient } from './messages.js';

import { getAlarmStatus, updateAlarmStatus } from '../db/alarm-repository.js';
import { alarmLogger } from '../utils/alarm-logger.js';

// store alarm status (on/off/down) in Redis DB and write logs to the alarm-logs.txt file
const handleAlarmStatus = async (
  roomId: string,
  status: AlarmStatus,
  timestamp: string,
  reason?: string): Promise<void> => {
  try {
    // old status of the alarm used for the logs
    const oldStatus = await getAlarmStatus(roomId);

    await updateAlarmStatus(roomId, status, timestamp);

    await alarmLogger(roomId, status, timestamp, oldStatus, reason);
  } catch (err) {
    console.error(`Error while setting alarm status to ${status}`, err);
  }
}

// called by alarms controller when an alarm is activated
export const handleAlarmOn = async (
  wss: WebSocketServer,
  roomId: string,
  timestamp: string): Promise<void> => {
  const existsRoom = await checkRoomExists(roomId);

  if (!existsRoom) {
    console.error('Room ID not found');
    return;
  }

  // make a call to the room phone from which has been activated the alarm
  await callRoom(roomId);

  // set status field of alarm to "on" into redis db
  await handleAlarmStatus(roomId, 'on', timestamp);

  const message = createWebSocketMessage('alarm_on', { roomId, timestamp });

  wss.clients.forEach(client => {
    sendMessageToClient(client, message);
  });
}

// called by main wss function when a ws client send the "turn off" alarm message
// called by alarms controller when an alarm is turned off by the alarm device
// called by health check service when an alarm is newly reachable
export const handleAlarmOff = async (
  wss: WebSocketServer,
  clientMessage: AlarmOffMessage,
  timestamp: string): Promise<void> => {
  const { roomId, reason } = clientMessage;

  const existsRoom = await checkRoomExists(roomId);

  if (!existsRoom) {
    console.error('Room ID not found');
    return;
  }

  // set status field of the alarm to "off" into redis db
  // lastDeactivation is used only for logs
  await handleAlarmStatus(roomId, 'off', timestamp, reason);

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
export const handleAlarmDown = async (
  wss: WebSocketServer,
  roomId: string,
  timestamp: string): Promise<void> => {
  await handleAlarmStatus(roomId, 'down', timestamp);

  const message = createWebSocketMessage('alarm_down', { roomId });

  wss.clients.forEach(client => {
    sendMessageToClient(client, message);
  });
}