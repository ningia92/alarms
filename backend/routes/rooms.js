import { Router } from 'express';
import { getRooms, getRoom, getAlarm } from '../controllers/rooms.js';

const roomRouter = Router();

roomRouter.get('/', getRooms);
roomRouter.get('/:id/', getRoom);
roomRouter.get('/:id/alarm', getAlarm);

export default roomRouter;