export type AlarmStatus = 'on' | 'off'

interface Alarm {
  ip: string;
  dev: string;
  status: AlarmStatus;
}

export interface Room {
  id: string;
  type: string;
  block: string;
  phone: number;
  alarm: Alarm;
};