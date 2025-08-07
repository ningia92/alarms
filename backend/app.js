import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import cors from 'cors';
import roomRouter from './routes/rooms.route.js';
import alarmDeviceRouter from './routes/alarmDevices.route.js';
import { notFound, errorHandler } from './middleware/error-handling.js';

const app = express();
// create an HTTP server to pass to both express and WebSocket server
const server = createServer(app);
// create an instance of WebSocket server
const wss = new WebSocketServer({ server });

// connection handler for the WebSockets
wss.on('connection', ws => {
  console.log('WebSocket client connected');

  ws.send('Connected to WebSocket server');

  ws.on('message', (data) => {
    console.log(`received: ${data}`);
  })

  ws.on('close', () => {
    console.log('WebSocket client disconnected');
  })
})

// make the WebSocket server globally accessible in the app so it can be used in controllers
app.set('wss', wss);

app.use(cors());

app.use('/api/v1/rooms', roomRouter);
// separate route for endpoint exposed to alarm devices
// NOTE: read the comment inside the route/alarmDevices.js file
app.use('/stanza', alarmDeviceRouter);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
server.listen(PORT, console.log(`Server listining on port ${PORT}`));