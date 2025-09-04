import rooms from '../db/data.json' with { type: 'json' };
import { getRedisClient } from '../db/redis-client.js';

const redisClient = getRedisClient();

const flushDB = async () => redisClient.flushDb();

// into the DB the rooms data are stored as hashes
// room and alarm are stored in separate hashes:
// a room is represented by the key "room:{roomId}"
// inside the room hash there is the "alarm" field
// which in turn is an hash key
// the alarm is represented by the key "room:{roomId}:alarm"
const loadData = async () => {
  console.log('Flushing database before loading data');
  await flushDB();

  console.log('Loading data...');
  for (const room of rooms) {
    const roomId = room.id;
    const alarmHash: RedisAlarmHash = room.alarm;
    const roomHash: RedisRoomHash = { ...room, alarm: `room:${roomId}:alarm` };

    await redisClient.hSet(`room:${roomId}`, { ...roomHash });
    await redisClient.hSet(`room:${roomId}:alarm`, { ...alarmHash });
  }
}

const runDataLoader = async () => {
  try {
    await loadData();
    console.log('Data load completed');
  } catch (err) {
    console.error('Error loading data:', err);
  } finally {
    await redisClient.close();
  }
}

await runDataLoader();