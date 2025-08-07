export const AlarmStatus = {
  Inactive: 0,
  Active: 1,
} as const;

export type TypeAlarmStatus = typeof AlarmStatus[keyof typeof AlarmStatus];

export interface Room {
  id: number;
  name: string;
  status: TypeAlarmStatus;
};