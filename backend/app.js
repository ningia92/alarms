import express from 'express';
import roomRouter from './routes/rooms.js'
import { notFound, errorHandler } from './middleware/error-handler.js';

const app = express();

app.get('/', (req, res) => res.send('Alarms Homepage'));
app.use('/api/v1/rooms', roomRouter);

app.use(notFound);
app.use(errorHandler);

const PORT  = process.env.PORT || 3000;
app.listen(PORT, console.log(`Server listining on port ${PORT}`));