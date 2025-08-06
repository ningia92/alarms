import { getRedisClient } from '../db/redis-client.js';

const redisClient = getRedisClient();

// @desc Get all rooms or rooms with alarm on/off
// @route GET /api/v1/rooms?alarm_status=on|off
export const getRooms = async (req, res) => {
  const alarmStatus = req.query.alarm_status;

  if (alarmStatus && (alarmStatus !== 'on' && alarmStatus !== 'off')) {
    const error = new Error('Bad request');
    error.statusCode = 400;
    throw error;
  }

  // scan was used istead of keys (await redisClient.keys('room:*'))
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

  const alarmFilter = alarmStatus
    ? expandedRooms.filter(room => room.alarm.status === alarmStatus)
    : expandedRooms;

  res.json(alarmFilter);
}

// @desc Get room
// @route GET /api/v1/rooms/:id
export const getRoom = async (req, res) => {
  const id = req.params.id;
  
  const room = await redisClient.hGetAll(`room:${id}`);

  if (Object.keys(room).length === 0) {
    const error = new Error('Room not found');
    error.statusCode = 404;
    throw error;
  }

  // because the alarm field contains a key it must be expanded
  const expandedRoom = { ...room, alarm: await redisClient.hGetAll(room.alarm) };

  res.json(expandedRoom);
}

