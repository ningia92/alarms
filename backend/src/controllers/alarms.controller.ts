import { Request, Response } from 'express';

import { handleAlarmOff, handleAlarmOn } from '../websocket/alarm-handler.js';

// @desc Turn on alarm
// @route GET /room/:id/alarm/on
export const turnOnAlarm = async (req: Request, res: Response) => {
  const roomId = req.params.id;
  const timestamp = new Date().toISOString();

  if (!roomId) {
    console.error('Missing room id');
    return;
  }

  await handleAlarmOn(req.wss, roomId, timestamp);

  // set these response headers to mitigate the problem of the caching caused by the unsafe GET
  // "Cache-Control: no-store" indicates that any caches of any kind (private or shared) should
  // not store the response
  // "Expires: 0" ensures compatibility even with older HTTP clients
  res
    .set('Cache-Control', 'no-store')
    .set('Expires', '0')
    .status(204)
    .end();
}

// @desc Turn off alarm from the alarm device
// @route GET /room/:id/alarm/off
export const turnOffAlarm = async (req: Request, res: Response) => {
  const roomId = req.params.id;
  const reason = 'Allarme risolto da manutentore';

  if (!roomId) {
    console.error('Missing room id');
    return;
  }

  const message: AlarmOffMessage = { roomId, reason } as AlarmOffMessage;

  await handleAlarmOff(req.wss, message);

  // set these response headers to mitigate the problem of the caching caused by the unsafe GET
  // "Cache-Control: no-store" indicates that any caches of any kind (private or shared) should
  // not store the response
  // "Expires: 0" ensures compatibility even with older HTTP clients
  res
    .set('Cache-Control', 'no-store')
    .set('Expires', '0')
    .status(204)
    .end();
}