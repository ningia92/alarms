import { Router } from 'express';
import { getRooms, getRoom } from '../controllers/rooms.js';

const roomRouter = Router();

roomRouter.get('/', getRooms);
roomRouter.get('/:id/', getRoom);

export default roomRouter;