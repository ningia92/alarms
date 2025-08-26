/* eslint-disable @typescript-eslint/no-misused-promises */
import { Server as HttpServer } from 'http';
import { WebSocket, WebSocketServer } from 'ws';

import { getRoomList } from '../services/room-service.js';
import { handleAlarmOff } from './handlers/alarm-handler.js';

declare module 'ws' {
  interface WebSocket {
    isAlive: boolean;
  }
}

export const initializeWebSocketServer = (server: HttpServer): WebSocketServer => {
  const wss = new WebSocketServer({ server });

  // if this function is called it means that the connection to client is up
  function heartBeat(this: WebSocket) {
    this.isAlive = true;
  }

  wss.on('connection', async (ws: WebSocket) => {
    console.log('WebSocket client connected');
    // set the initial state of client and handle the ping response
    ws.isAlive = true;
    ws.on('pong', heartBeat);

    // send room list to the newly connected web socket client
    try {
      const roomList = await getRoomList();
      ws.send(JSON.stringify({ rooms: roomList, type: 'room_list' }));
    } catch (err) {
      console.error('Error retrieving data from db', err);
      ws.send(JSON.stringify({ info: 'Unable to retrieve data from db', type: 'error' }));
    };

    ws.on('message', async (msg: string) => {
      try {
        const parsedMsg: WebSocketMessage = JSON.parse(msg) as WebSocketMessage;
  
        switch (parsedMsg.type) {
          case 'alarm_off':
            await handleAlarmOff(wss, parsedMsg);
            break;
          default:
            console.log(`Unknown message type: ${parsedMsg.type}`);
        }
      } catch (err) {
        console.error('Failed to parse message or handle logic', err);
      }
    });

    ws.on('error', (err: Error) => {
      console.error('WebSocket Error', err);
    });

    ws.on('close', () => {
      console.log('WebSocket client disconnected');
    });
  });

  // terminate the broken connections for dead clients and
  // send a 'ping' for the others, if they repond with a 'pong'
  // the event 'pong' will return isAlive to true with the function heartBeat
  const ping = () => {
    wss.clients.forEach((ws: WebSocket) => {
      if (!ws.isAlive) {
        ws.terminate();
        return;
      }

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