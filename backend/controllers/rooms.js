import { getRedisClient } from '../db/redis-client.js';

const redisClient = getRedisClient();

export const getRooms = async (req, res) => {
  // scan was used istead of keys (await redisClient.keys('room:*'))
  // because keys is not recommended for production use
  const keyList = [];
  for await (const keys of redisClient.scanIterator({MATCH: 'room:*'}))
    keys.forEach(key => keyList.push(key));

  if (keyList.length === 0) return res.json({ message: 'No rooms' });

  // regex to filter only the room keys (excluding alarm keys)
  const roomRegex = /^room:(\d){2}-(\d){2}$/g;
  const roomKeys = keyList.filter(key => key.match(roomRegex));

  // get the values of all the fields of the selected hash
  const rooms = await Promise.all(roomKeys.map(key => redisClient.hGetAll(key)));

  // because the alarm field contains a key it must be expanded
  const expandedRooms = await Promise.all(rooms.map(async room => {
    return { ...room, alarm: await redisClient.hGetAll(room.alarm) }
  }));

  res.json(expandedRooms);
}