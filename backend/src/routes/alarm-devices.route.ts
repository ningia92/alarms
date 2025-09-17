import { Router } from 'express';

import { turnOffAlarm, turnOnAlarm } from '../controllers/alarms.controller.js';
import { authorizeDevice } from '../middleware/auth-device.js';

const alarmDeviceRouter = Router();

// WARNING: according to the HTTP specification, the get method is a safe method (read-only),
// meaning it is not intended to cause server changes, as in this case. Here, the GET is
// used to change the alarm state.
// Practical risk: if a GET modify a state, proxy or client could cache the response or pre-loading
// the link, causing indesiderable executions.
// =================================================================================================
// NOTE: the limitation is due to the devices itself, which are shelly i3.
// In the future it would be a good idea to change the get method to: PATCH /api/v1/rooms/:id/alarm with
// payload { "status": "on" } or { "status": "off" }.
alarmDeviceRouter.get('/:id/alarm/on', authorizeDevice, turnOnAlarm);
alarmDeviceRouter.get('/:id/alarm/off', authorizeDevice, turnOffAlarm);

export default alarmDeviceRouter;