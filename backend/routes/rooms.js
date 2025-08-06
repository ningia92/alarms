import { Router } from 'express';
import { getRooms, getRoom, turnOffAlarm } from '../controllers/rooms.js';

const roomRouter = Router();

roomRouter.get('/', getRooms);
roomRouter.get('/:id/', getRoom);
roomRouter.patch('/:id/alarm', turnOffAlarm);

export default roomRouter;