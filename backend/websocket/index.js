import { WebSocketServer } from 'ws';
import { getRoomList } from '../services/room-service.js';
import { handleAlarmOff } from './handlers/alarm-handler.js';

export const initializeWebSocketServer = (server) => {
  const wss = new WebSocketServer({ server });

  // if this function is called it means that the connection to client is up
  function heartBeat() {
    this.isAlive = true;
  }

  wss.on('connection', async (ws) => {
    console.log('WebSocket client connected');
    // set the initial state of client and handle the ping response
    ws.isAlive = true;
    ws.on('pong', heartBeat);

    // send room list to the newly connected web socket client
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

    ws.on('error', (err) => console.error('WebSocket Error', err));

    ws.on('close', () => {
      console.log('WebSocket client disconnected');
    });
  });

  // terminate the broken connections for dead clients and
  // send a 'ping' for the others, if they repond with a 'pong'
  // the event 'pong' will return isAlive to true with the function heartBeat
  const ping = () => {
    wss.clients.forEach(ws => {
      if (ws.isAlive === false) return ws.terminate();

      ws.isAlive = false;
      ws.ping();
    })
  }

  // set the interval for the ping call to 3 seconds
  const interval = setInterval(ping, 3000);

  // clean the interval when the server is closed
  wss.on('close', () => {
    clearInterval(interval);
  })

  return wss;
}