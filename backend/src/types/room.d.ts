///////////////////////////////////////////
// interfaces for data stored into redis db
///////////////////////////////////////////

// raw data from Redis
interface RedisRoomHash {
  id: string;
  type: string;
  block?: string;
  phone?: string;
  alarm: string; // This will be the key to the Redis alarm hash
}

interface Room {
  id: string;
  type: string;
  block?: string;
  phone?: string;
  alarm: Alarm;
}

interface Alarm {
  ip: string;
  dev: string;
  num: string;
  status: string;
  lastActivation: string;
}