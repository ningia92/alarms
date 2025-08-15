import { getRoomList } from '../../services/room-service.js';
import { setAlarmStatus } from '../../services/alarm-service.js';

export const handleAlarmOn = async (wss, roomId, timestamp) => {
  const message = JSON.stringify({ type: 'alarm_on', roomId, status: 'on', lastUpdate: timestamp });

  if (roomId) {
    // set status field of alarm to on into redis db
    await setAlarmStatus(roomId, 'on', timestamp);

    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        try {
          client.send(message);
        } catch (err) {
          console.error('Error while sending alarm trigger web socket message', err);
          client.send(JSON.stringify({ type: 'error', info: 'Unable to retrieve alarm status' }));
        }
      }
    })
  }
}

export const handleAlarmOff = async (wss, message) => {
  const { roomId, timestamp } = message;

  if (roomId) {
    // set status field of alarm to off into redis db
    await setAlarmStatus(roomId, 'off', timestamp);

    wss.clients.forEach(async client => {
      if (client.readyState === WebSocket.OPEN) {
        try {
          const roomList = await getRoomList();
          client.send(JSON.stringify({ type: 'room_list', rooms: roomList }));
        } catch (err) {
          console.error('Error while sending updated room list after the alarm has been turned off', err);
          client.send(JSON.stringify({ type: 'error', info: 'Unable to retrieve room list' }));
        }
      }
    })
  }
}