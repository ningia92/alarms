//////////////////////////////////////////////
// interfaces for data stored into redis db //
//////////////////////////////////////////////

type AlarmStatus = 'on' | 'off' | 'down';

interface Alarm {
  ip: string;
  dev: string;
  num: string;
  status: AlarmStatus;
  lastActivation: string;
}

// block and phone are optional because the pool doesn't has them
interface Room {
  id: string;
  type: string;
  block?: string;
  phone?: string;
  alarm: Alarm;
}

// raw data for Redis alarm hash
interface RedisAlarmHash {
  ip: string;
  dev: string;
  num: string;
  status: string;
  lastActivation: string;
}

// raw data for Redis room hash
interface RedisRoomHash {
  id: string;
  type: string;
  block?: string;
  phone?: string;
  alarm: string; // This corresponds to the key of the Redis alarm hash
}