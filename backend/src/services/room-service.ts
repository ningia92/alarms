import fetch from 'node-fetch';
import { RedisClientType } from 'redis';

import { getRedisClient } from '../db/redis-client.js';

const redisClient: RedisClientType = getRedisClient();

export const getRoomList = async (): Promise<Room[]> => {
  try {
    const keyList: string[] = [];
    
    // scan was used istead of keys (redisClient.keys('room:*'))
    // because is more efficient compared to keys
    // keys is not recommended in production
    for await (const keys of redisClient.scanIterator({ MATCH: 'room:*' })) {
      keys.forEach((key: string) => keyList.push(key));
    }
  
    if (keyList.length === 0) throw new Error('No rooms found');
  
    // regex to filter only the room keys (excluding alarm keys)
    // because scan iterator return also alarm hashes (room:{roomId}:alarm)
    // this is necessary because redis doesn't offer complex regexes
    const roomRegex = /^room:(\d){2}-(\d){2}$/g;
    const roomKeys: string[] = keyList.filter((key: string) => key.match(roomRegex));
  
    const rawRooms = await Promise.all(roomKeys.map(key => redisClient.hGetAll(key)));
  
    // type guards to verify at runtime that an unkown value has the expected properties
    const isRedisRoomHash = (obj: unknown): obj is RedisRoomHash => {
      return typeof obj === 'object' && obj !== null && 'id' in obj && 'type' in obj && 'alarm' in obj;
    };
    const isAlarm = (obj: unknown): obj is Alarm => {
      return typeof obj === 'object' && obj !== null &&
        'ip' in obj && 'dev' in obj && 'num' in obj && 'status' in obj && 'lastActivation' in obj;
    };
  
    const rooms: Room[] = [];
  
    // because the alarm field contains a key it must be expanded
    for (const rawRoom of rawRooms) {
      if (!isRedisRoomHash(rawRoom)) {
        console.error('Invalid room data');
        continue;
      }
  
      const alarmDetails = await redisClient.hGetAll(rawRoom.alarm);
  
      if (!isAlarm(alarmDetails)) {
        console.error(`Invalid alarm data for the room ${rawRoom.id}`);
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

// get phone number of the room
const getRoomNumber = async (roomId: string): Promise<string | null> => {
  try {
    return await redisClient.hGet(`room:${roomId}`, 'number');
  } catch (err) {
    console.error('Error during get the telephone number of the room', err);
    return null;
  }
}

// function that call the room phone, through API Wildix PBX, when the alarm is turned on
export const callRoom = async (roomId: string) => {
  const url = process.env.PBX_URL ?? '';
  const username = process.env.PBX_USER ?? '';
  const password = process.env.PBX_PWD ?? '';

  if (!url || !username || !password) {
    console.error('Missing required environment variables for Wildix API');
    return;
  }

  const number = await getRoomNumber(roomId);
  if (number === null) {
    console.error(`Could not find a phone number for room ID: ${roomId}`);
    return;
  }

  const credentials = Buffer.from(`${username}:${password}`).toString('base64');
  const params = new URLSearchParams({ number }).toString();

  try {
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
    console.error('Error during the API Wildix PBX call', err);
  }
}