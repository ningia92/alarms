import { getRedisClient } from '../db/redis-client.js';

const redisClient = getRedisClient();

// @desc Turn on alarm
// @route GET /stanza/:id/allarme/on
export const turnOnAlarm = async (req, res) => {
  const id = req.params.id;

  // input validation of the room id
  if (!id.match(/^(\d)+-(\d)+$/g)) {
    const error = new Error('Bad request');
    error.statusCode = 400;
    throw error;
  }

  const room = await redisClient.exists(`room:${id}`);

  if (!room) {
    const error = new Error('Room not found');
    error.statusCode = 404;
    throw error;
  }

  await redisClient.hSet(`room:${id}:alarm`, { status: 'on' });

  const wss = req.app.get('wss');
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type: 'alarm_status_changed', roomId: id, status: 'on' }));
    }
  });

  // set these response headers to mitigate the problem of the caching caused by the unsafe GET
  // Cache-Control: no-store indicates that any caches of any kind (private or shared) should
  // not store the reponse
  // Expires: 0 ensures compatibility even with older HTTP clients
  res
    .set('Cache-Control', 'no-store')
    .set('Expires', '0')
    .status(204)
    .end();
}