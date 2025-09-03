////////////////////////////////////////
// interfaces for web socket messages //
////////////////////////////////////////
interface BaseMessage {
  type: string;
}

interface RoomListMessage extends BaseMessage {
  rooms: Room[];
}

interface AlarmDownMessage extends BaseMessage {
  roomId: string;
  status: string;
}

interface AlarmOnMessage extends BaseMessage {
  roomId: string;
  status: string;
  lastActivation: string;
}

interface AlarmOffMessage extends BaseMessage {
  roomId: string;
  reason: string;
}

interface ErrorMessage extends BaseMessage {
  info: string;
}

type WebSocketMessage = BaseMessage | RoomListMessage | AlarmDownMessage | AlarmOnMessage | AlarmOffMessage | ErrorMessage;