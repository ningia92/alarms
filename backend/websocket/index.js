import { WebSocketServer } from 'ws';
import { getRoomList } from '../services/room-service.js';
import { handleAlarmOff } from './handlers/alarm-handler.js';

export const initializeWebSocketServer = (server) => {
  const wss = new WebSocketServer({ server });

  wss.on('connection', async (ws) => {
    console.log('WebSocket client connected');

    // send intial list of rooms to the new web socket client
    try {
      const roomList = await getRoomList();
      ws.send(JSON.stringify({ type: 'room_list', rooms: roomList }));
    } catch (err) {
      console.error('Error retrieving data from db', err);
      ws.send(JSON.stringify({ type: 'error', info: 'Unable to retrieve data from db' }));
    };

    ws.on('message', async (message) => {
      const msg = JSON.parse(message);

      switch (msg.type) {
        case 'alarm_off':
          await handleAlarmOff(wss, msg);
          break;
        default:
          console.log(`Unknown message type: ${msg.type}`);
      }
    });

    ws.on('close', () => {
      console.log('WebSocket client disconnected');
    });
  });

  return wss;
}