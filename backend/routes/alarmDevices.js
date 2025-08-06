import { Router } from 'express';
import { turnOnAlarm } from '../controllers/alarmDevices.js';

const alarmDeviceRouter = Router();

// WARNING: according to the HTTP specification, the get method is a safe method (read-only),
// meaning it is not intended to cause server changes, as in this case. In fact, here the GET is
// used to change the alarm state (from off to on).
// Practical risk: if a GET modify a state, proxy or client could cache the response or pre-loading
// the link, causing indesiderable executions.
// =================================================================================================
// NOTE: the endpoint was taken from the previous system implementation and is not editable, but in
// the future it would be a good idea to change the get method to: PATCH /api/v1/rooms/:id/alarm with
// payload { "status": "on" }.
alarmDeviceRouter.get('/:id/allarme/on', turnOnAlarm);

export default alarmDeviceRouter;