import { getRoomList } from '../../services/room-service.js';
import { setAlarmStatus } from '../../services/alarm-service.js';

export const handleAlarmOn = async (wss, roomId, lastActivation) => {
  const message = JSON.stringify({ type: 'alarm_on', roomId, status: 'on', lastActivation });

  if (roomId) {
    // set status field of alarm to on into redis db
    await setAlarmStatus(roomId, 'on', lastActivation);

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
  const { roomId } = message;
  const lastDeactivation = new Date().toISOString();

  if (roomId) {
    // set status field of the alarm to off into redis db
    // lastDeactivation is used only for logs
    await setAlarmStatus(roomId, 'off', lastDeactivation);

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