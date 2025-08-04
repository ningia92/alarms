import { createClient } from 'redis';

const client = createClient();

client.on('error', error => console.log('Redis Client Error', error));

await client.connect();

export const getClient = () => client;