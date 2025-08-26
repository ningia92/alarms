/////////////////////////////////////
// interfaces for web socket messages
/////////////////////////////////////
interface BaseMessage {
  type: string;
}

interface RoomListMessage extends BaseMessage {
  type: 'room_list';
  rooms: Room[];
}

interface AlarmOnMessage extends BaseMessage {
  type: 'alarm_on';
  roomId: string;
  status: 'on';
  lastActivation: string;
}

interface AlarmOffMessage extends BaseMessage {
  type: 'alarm_off';
  roomId: string;
}

interface ErrorMessage extends BaseMessage {
  type: 'error';
  info: string;
}

type WebSocketMessage = RoomListMessage | AlarmOnMessage | AlarmOffMessage | ErrorMessage;