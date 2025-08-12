import { setAlarmToOn } from '../services/alarm-service.js';
import WebSocket from 'ws';

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

  await setAlarmToOn(id);

  // send web socket message to all connected clients
  const message = JSON.stringify({ type: 'alarm_on', roomId: id, status: 'on' });

  req.wsClients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  })

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