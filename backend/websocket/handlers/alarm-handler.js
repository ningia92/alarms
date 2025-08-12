import { getRoomList } from '../../services/room-service.js';
import { setAlarmToOn, setAlarmToOff } from '../../services/alarm-service.js';

export const handleAlarmOn = async (wss, roomId) => {
  const message = JSON.stringify({ type: 'alarm_on', roomId, status: 'on' });

  if (roomId) {
    await setAlarmToOn(roomId);

    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        try {
          client.send(message);
        } catch (err) {
          console.error('Error sending alarm status', err);
          client.send(JSON.stringify({ type: 'error', info: 'Unable to retrieve alarm status' }));
        }
      }
    })
  }
}

export const handleAlarmOff = async (wss, message) => {
  const { roomId } = message;

  if (roomId) {
    await setAlarmToOff(roomId);

    wss.clients.forEach(async client => {
      if (client.readyState === WebSocket.OPEN) {
        try {
          const roomList = await getRoomList();
          client.send(JSON.stringify({ type: 'room_list', rooms: roomList }));
        } catch (err) {
          console.error('Error sending updated room list', err);
          client.send(JSON.stringify({ type: 'error', info: 'Unable to retrieve data' }));
        }
      }
    })
  }
}