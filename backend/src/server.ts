import express, { Express, Request, Response, NextFunction } from 'express';
import { createServer, Server as HttpServer } from 'http';
import { WebSocketServer } from 'ws';
import cors from 'cors';

import { errorHandler, notFound } from './middleware/error-handling.js';
import alarmDeviceRouter from './routes/alarm-devices.route.js';
import { initializeWebSocketServer } from './websocket/index.js';

// extend Express Request interface to include the ws property
declare module 'express-serve-static-core' {
  interface Request {
    wss: WebSocketServer;
  }
}

const app: Express = express();
// create an HTTP server to pass express app
const server: HttpServer = createServer(app);
// create an instance of WebSocket server and pass server to it
const wss: WebSocketServer = initializeWebSocketServer(server);

app.use((req: Request, res: Response, next: NextFunction) => {
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

const PORT: string = process.env.PORT ?? '3000';
server.listen(PORT, () => {
  console.log(`Server listining on port ${PORT}`)
});