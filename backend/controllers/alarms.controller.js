import { handleAlarmOn } from '../websocket/handlers/alarm-handler.js';

// @desc Turn on alarm
// @route GET /stanza/:id/allarme/on
export const turnOnAlarm = async (req, res) => {
  const id = req.params.id;
  const lastUpdate = new Date().toISOString();

  // input validation of the room id
  if (!id.match(/^(\d)+-(\d)+$/g)) {
    const error = new Error('Bad request');
    error.statusCode = 400;
    throw error;
  }

  await handleAlarmOn(req.wss, id, lastUpdate);

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