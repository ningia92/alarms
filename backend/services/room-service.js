import { getRedisClient } from '../db/redis-client.js';
import fetch from 'node-fetch';

const redisClient = getRedisClient();

export const getRoomList = async () => {
  // scan was used istead of keys (redisClient.keys('room:*'))
  // because keys is not recommended for production use
  const keyList = [];
  for await (const keys of redisClient.scanIterator({ MATCH: 'room:*' }))
    keys.forEach(key => keyList.push(key));

  if (keyList.length === 0) throw new Error('No rooms found');

  // regex to filter only the room keys (excluding alarm keys)
  const roomRegex = /^room:(\d){2}-(\d){2}$/g;
  const roomKeys = keyList.filter(key => key.match(roomRegex));

  const rooms = await Promise.all(roomKeys.map(key => redisClient.hGetAll(key)));

  // because the alarm field contains a key it must be expanded
  const expandedRooms = await Promise.all(rooms.map(async room => {
    return { ...room, alarm: await redisClient.hGetAll(room.alarm) }
  }));

  return expandedRooms;
}

const getRoomNumber = async (roomId) => {
  try {
    return await redisClient.hGet(`room:${roomId}`, 'number');
  } catch (err) {
    console.error('Error during get the telephone number of the room', err);
  }
}

// function that call the room, through API Wildix PBX, when the alarm is turned on
export const callRoom = async (roomId) => {
  const url = ''; // process.env.PBX_URL;
  const username = ''; // process.env.PBX_USER;
  const password = ''; // process.env.PBX_PWD;
  const number = getRoomNumber(roomId);

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