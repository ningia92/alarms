export type AlarmStatus = 'on' | 'off' | 'down'

interface Alarm {
  ip: string;
  dev: string;
  status: AlarmStatus;
  lastUpdate: Date;
  lastActivation: Date;
}

export interface Room {
  id: string;
  block: string;
  phone: number;
  alarm: Alarm;
};