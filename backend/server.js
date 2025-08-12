import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import cors from 'cors';
import { notFound, errorHandler } from './middleware/error-handling.js';
import alarmDeviceRouter from './routes/alarm-devices.route.js';
import { getRoomListService } from './services/room-service.js';
import { setAlarmToOff } from './services/alarm-service.js';

const app = express();
// create an HTTP server to pass express app
const server = createServer(app);
// create an instance of WebSocket server and pass server to it
const wss = new WebSocketServer({ server });

// connection handler for the WebSockets
wss.on('connection', async ws => {
  wss.clients.add(ws);
  console.log('WebSocket client connected');

  try {
    const roomList = await getRoomListService();
    ws.send(JSON.stringify({ type: 'room_list', rooms: roomList }));
  } catch (err) {
    console.error('Error retrieving data from db', err);
    ws.send(JSON.stringify({ type: 'error', info: 'Unable to retrieve data from db' }));
  };

  ws.on('message', async (message) => {
    const msg = JSON.parse(message);

    if (msg.type === 'alarm_off' && msg.roomId) {
      await setAlarmToOff(msg.roomId);

      wss.clients.forEach(async client => {
        if (client.readyState === WebSocket.OPEN) {
          const roomList = await getRoomListService();
          client.send(JSON.stringify({ type: 'room_list', rooms: roomList }));
        }
      })
    }
  });

  ws.on('close', () => {
    wss.clients.delete(ws);
    console.log('WebSocket client disconnected');
  });
});

app.use((req, res, next) => {
  req.wss = wss;
  req.wsClients = wss.clients;
  next();
});

app.use(express.json());
app.use(cors());

// route for endpoint exposed to alarm devices
// NOTE: read the comment inside the route/alarmDevices.js file
app.use('/stanza', alarmDeviceRouter);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
server.listen(PORT, console.log(`Server listining on port ${PORT}`));

export default server;