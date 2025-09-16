import express, { Express, Request, Response, NextFunction } from 'express';
import { createServer, Server as HttpServer } from 'http';
import { WebSocketServer } from 'ws';
import cors from 'cors';

import alarmDeviceRouter from './routes/alarm-devices.route.js';
import { initializeWebSocketServer } from './websocket/index.js';
import { startPeriodicDeviceChecks } from './services/health-check-service.js';

// extend Express Request interface to include the ws property
declare module 'express-serve-static-core' {
  interface Request {
    wss: WebSocketServer;
  }
}

const app: Express = express();

// create an HTTP server to pass to the express app
const server: HttpServer = createServer(app);

// create an instance of WebSocket server and pass server to it
const wss: WebSocketServer = initializeWebSocketServer(server);

// extend Request interface to include wss instance to make it accessible to controllers
app.use((req: Request, res: Response, next: NextFunction) => {
  req.wss = wss;
  next();
});

app.use(express.json());

app.use(cors());

// route for the endpoint exposed to alarm devices
app.use('/rooms', alarmDeviceRouter);

const PORT: string = process.env.PORT ?? '3000';
server.listen(PORT, () => {
  console.log(`Server listining on port ${PORT}`);

  // periodic device alarm checks (if the alarms are up)
  startPeriodicDeviceChecks(wss);
});