import { getRoomList } from '../services/room-service.js';

const checkUpdate = async (alarmIp: string): Promise<boolean> => {
  const response = await fetch(`http://${alarmIp}/ota`);

  const data = await response.json() as { has_update: boolean };

  return data.has_update;
}

const updateAlarms = async () => {
  try {
    const rooms: Room[] = await getRoomList();

    for (const room of rooms) {
      const alarmIp = room.alarm.ip;
      const hasUpdate = await checkUpdate(alarmIp);

      if (hasUpdate) {
        const fullUrl = `http://${alarmIp}/ota?update=true`;

        await fetch(fullUrl);

        console.log('Succesfully device update');
      } else {
        console.error('Error during device update');
      }
    }
  } catch (err) {
    console.error('Error while updating all the alarms', err);
  }
}

await updateAlarms();