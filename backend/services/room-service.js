import { getRedisClient } from '../db/redis-client.js';

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