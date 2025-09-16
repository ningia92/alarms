//////////////////////////////////////////////
// interfaces for data stored into redis db //
//////////////////////////////////////////////

type AlarmStatus = 'on' | 'off' | 'down';

// the alarms are shelly i3.
// more info in the configuration script file src/utils/config-utils.ts
interface Alarm {
  ip: string;
  inputChannel: string;
  status: AlarmStatus;
  lastActivation: string;
}

// type: used to differentiate between room and pool
// block: used to divide rooms into sections
// block and phone are optional because the pool doesn't has them
interface Room {
  id: string;
  block?: string;
  phone?: string;
  alarm: Alarm;
}

// raw data for Redis alarm hash
interface RedisAlarmHash {
  ip: string;
  inputChannel: string;
  status: string;
  lastActivation: string;
}

// raw data for Redis room hash
interface RedisRoomHash {
  id: string;
  block?: string;
  phone?: string;
  alarm: string; // This corresponds to the key of the Redis alarm hash
}