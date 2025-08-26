import rooms from '../db/data.json' with { type: 'json' };
import { getRedisClient } from '../db/redis-client.js';

const redisClient = getRedisClient();

const flushDB = async () => redisClient.flushDb();

const loadData = async () => {
  console.log('Flushing database before loading data');
  await flushDB();

  console.log('Loading data...');
  for (const room of rooms) {
    const id = room.id;
    const alarm: Alarm = room.alarm;
    const roomWithAlarmKey: RedisRoomHash = { ...room, alarm: `room:${id}:alarm` };

    await redisClient.hSet(`room:${id}`, { ...roomWithAlarmKey });
    await redisClient.hSet(`room:${id}:alarm`, { ...alarm });
  }
}

const runDataLoader = async () => {
  try {
    await loadData();
    console.log('Data load completed');
  } catch (e) {
    console.log('Error loading data');
    console.log(e);
  } finally {
    await redisClient.close();
  }
}

await runDataLoader();