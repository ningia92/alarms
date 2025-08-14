import { getRedisClient } from '../db/redis-client.js';
import rooms from '../db/data.json' with { type: 'json' };

const redisClient = getRedisClient();

const flushDB = async () => redisClient.flushDb();

const loadData = async () => {
  console.log('Flushing database before loading data');
  await flushDB();

  console.log('Loading data...');
  for (const room of rooms) {
    const id = room.id;
    const alarm = room['alarm'];

    room['alarm'] = `room:${id}:alarm`;

    await redisClient.hSet(`room:${id}`, room);
    await redisClient.hSet(`room:${id}:alarm`, alarm);
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

runDataLoader();