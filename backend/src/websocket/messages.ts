import { WebSocket } from 'ws';

export const createWebSocketMessage = (
  type: string,
  options: {
    roomId?: string,
    timestamp?: string,
    roomList?: Room[]
  }): WebSocketMessage => {
  let message: WebSocketMessage = { type };

  switch (type) {
    case 'alarm_on':
      message = {
        type,
        roomId: options.roomId,
        status: 'on',
        lastActivation: options.timestamp
      } as AlarmOnMessage;
      break;
    case 'alarm_down':
      message = {
        type,
        roomId: options.roomId,
        status: 'down'
      } as AlarmDownMessage;
      break;
    case 'room_list':
      message = {
        type,
        rooms: options.roomList
      } as RoomListMessage;
      break;
    default:
      message = {
        type: 'error',
        info: 'Invalid web socket message type'
      } as ErrorMessage;
      break;
  }

  return message;
}

export const sendMessageToClient = (client: WebSocket, message: WebSocketMessage) => {
  if (client.readyState === WebSocket.OPEN) {
    client.send(JSON.stringify(message));
  } else if (client.readyState === WebSocket.CLOSED) {
    console.error(`Client not available state = CLOSED)`);
  }
}