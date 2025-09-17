export type AlarmStatus = 'on' | 'off' | 'down'

interface Alarm {
  ip: string;
  status: AlarmStatus;
  lastActivation: Date;
}

export interface Room {
  id: string;
  block: string;
  phone: number;
  alarm: Alarm;
};