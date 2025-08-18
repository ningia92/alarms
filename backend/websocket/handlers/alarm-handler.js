import { getRoomList, callRoom } from '../../services/room-service.js';
import { setAlarmStatus } from '../../services/alarm-service.js';

export const handleAlarmOn = async (wss, roomId, lastActivation) => {
  const message = JSON.stringify({ type: 'alarm_on', roomId, status: 'on', lastActivation });

  if (roomId) {
    // make the call to the room that activeted the alarm
    await callRoom(roomId);

    // set status field of alarm to "on" into redis db
    await setAlarmStatus(roomId, 'on', lastActivation);

    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        try {
          client.send(message);
        } catch (err) {
          console.error('Error while sending web socket message to clients', err);
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
    // set status field of the alarm to "off" into redis db
    // lastDeactivation is used only for logs
    await setAlarmStatus(roomId, 'off', lastDeactivation);

    wss.clients.forEach(async client => {
      if (client.readyState === WebSocket.OPEN) {
        try {
          const roomList = await getRoomList();
          client.send(JSON.stringify({ type: 'room_list', rooms: roomList }));
        } catch (err) {
          console.error('Error while sending web socket message to clients', err);
          client.send(JSON.stringify({ type: 'error', info: 'Unable to retrieve room list' }));
        }
      }
    })
  }
}