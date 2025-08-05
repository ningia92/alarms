import express from 'express';
import roomRouter from './routes/rooms.js'

const app = express();

app.get('/', (req, res) => res.send('Alarms Homepage'));
app.use('/api/v1/rooms', roomRouter);

const PORT  = process.env.PORT || 3000;
app.listen(PORT, console.log(`Server listining on port ${PORT}`));