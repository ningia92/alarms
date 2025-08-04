import { getClient } from '../db/redis-client.js';
import rooms from './data.json' with { type: 'json' };

const client = getClient();

const flushDB = async () => client.flushDb();

const loadData = async () => {
  console.log('Flushing database before loading data');
  await flushDB();

  console.log('Loading data...');
  for (const room of rooms) {
    const id = room.id;
    const alarm = room['alarm'];

    room['alarm'] = `room:${id}:alarm`;

    await client.hSet(`room:${id}`, room);
    await client.hSet(`room:${id}:alarm`, alarm);
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
    await client.quit();
  }
}

runDataLoader();