import { Router } from 'express';
import { getRooms } from '../controllers/rooms.js';

const roomRouter = Router();

roomRouter.get('/', getRooms);

export default roomRouter;