import { getRedisClient } from '../db/redis-client.js';

const redisClient = getRedisClient();

// @desc Turn on alarm
// @route GET /stanza/:id/allarme/on
export const turnOnAlarm = async (req, res) => {
  const id = req.params.id;

  await redisClient.hSet(`room:${id}:alarm`, { status: 'on' });

  // set these response headers to mitigate the problem of the caching caused by the unsafe GET
  res
    .set('Cache-Control', 'no-store')
    .set('Expires', '0')
    .status(204)
    .end();
}