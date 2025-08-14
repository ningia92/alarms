export type AlarmStatus = 'on' | 'off'

interface Alarm {
  ip: string;
  dev: string;
  status: AlarmStatus;
  lastUpdate: Date;
}

export interface Room {
  id: string;
  type: string;
  block: string;
  phone: number;
  alarm: Alarm;
};