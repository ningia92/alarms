import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import { notFound, errorHandler } from './middleware/error-handling.js';
import alarmDeviceRouter from './routes/alarm-devices.route.js';
import { initializeWebSocketServer } from './websocket/index.js';

const app = express();
// create an HTTP server to pass express app
const server = createServer(app);
// create an instance of WebSocket server and pass server to it
const wss = initializeWebSocketServer(server);

app.use((req, res, next) => {
  req.wss = wss;
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