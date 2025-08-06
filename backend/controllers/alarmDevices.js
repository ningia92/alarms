import { getRedisClient } from '../db/redis-client.js';

const redisClient = getRedisClient();

// @desc Turn on alarm
// @route GET /stanza/:id/allarme/on
export const turnOnAlarm = async (req, res) => {
  const id = req.params.id;

  await redisClient.hSet(`room:${id}:alarm`, { status: 'on' });

  res.status(204).end();
}