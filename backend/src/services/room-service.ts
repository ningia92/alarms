import fetch from 'node-fetch';
import { getRoomKeys, getRoomData, roomExists, getPhoneNumber } from '../db/room-repository.js';
import { getAlarmData } from '../db/alarm-repository.js';

// type guard to verify at runtime that an unknown value has the expected properties of the redis room hash
const isRedisRoomHash = (obj: unknown): obj is RedisRoomHash => {
  return typeof obj === 'object' && obj !== null && 'id' in obj && 'type' in obj && 'alarm' in obj;
};

// type guard to verify at runtime that an unknown value has the expected properties of the alarm
const isAlarm = (obj: unknown): obj is Alarm => {
  return typeof obj === 'object' && obj !== null &&
    'ip' in obj && 'dev' in obj && 'num' in obj && 'status' in obj && 'lastActivation' in obj;
};

export const getRoomList = async (): Promise<Room[]> => {
  try {
    const roomKeys: string[] = await getRoomKeys();

    if (roomKeys.length === 0) {
      console.error('No rooms found');
      return [];
    }

    const rawRooms = await Promise.all(roomKeys.map(key => getRoomData(key)));

    const rooms: Room[] = [];

    for (const rawRoom of rawRooms) {
      if (!isRedisRoomHash(rawRoom)) {
        console.error('Invalid room data');
        continue;
      }

      const alarmDetails = await getAlarmData(rawRoom.alarm);

      if (!isAlarm(alarmDetails)) {
        console.error(`Invalid alarm data for room ${rawRoom.id}`);
        continue;
      }

      const completeRoom: Room = { ...rawRoom, alarm: alarmDetails };
      rooms.push(completeRoom);
    }

    return rooms;
  } catch (err) {
    console.error('Error during get the room list:', err);
    throw err;
  }
}

export const checkRoomExists = async (roomId: string): Promise<boolean> => {
  try {
    const isRoomExistent = await roomExists(roomId);
  
    if (isRoomExistent === 0) {
      return false;
    }
  } catch (err) {
    console.error('Error during check existence of the room:', err);
  }
  
  return true;
}

// function that call the room phone, through API Wildix PBX, when the alarm is turned on
export const callRoom = async (roomId: string): Promise<void> => {
  const url = process.env.PBX_URL ?? '';
  const username = process.env.PBX_USER ?? '';
  const password = process.env.PBX_PWD ?? '';

  if (!url || !username || !password) {
    console.error('Missing required environment variables for Wildix API');
    return;
  }

  try {
    const phoneNumber = await getPhoneNumber(roomId);

    if (!phoneNumber) {
      console.error(`Phone number not found for room ID: ${roomId}`);
      return;
    }

    const credentials = Buffer.from(`${username}:${password}`).toString('base64');
    const params = new URLSearchParams({ phoneNumber }).toString();

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-type': 'application/x-www-urlencoded'
      },
      body: params
    });

    const responseText = await response.text();

    if (response.status !== 200) {
      console.error('Wildix API call error', response.status, responseText);
    } else {
      console.log('Wildix API call OK');
    }
  } catch (err) {
    console.error('Error during the API Wildix PBX call:', err);
  }
}