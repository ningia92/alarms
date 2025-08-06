import express from 'express';
import roomRouter from './routes/rooms.route.js';
import alarmDeviceRouter from './routes/alarmDevices.route.js';
import { notFound, errorHandler } from './middleware/error-handling.js';

const app = express();

app.get('/', (req, res) => res.send('Alarms Homepage'));
app.use('/api/v1/rooms', roomRouter);
// separate route for endpoint exposed to alarm devices
// NOTE: read the comment inside the route/alarmDevices.js file
app.use('/stanza', alarmDeviceRouter);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, console.log(`Server listining on port ${PORT}`));