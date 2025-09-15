import { getDeviceUrl, getRequestList, makeRequests } from './config-utils.js';
import { getRoom } from '../services/room-service.js';

const configureAlarm = async (roomId: string): Promise<void> => {
  try {
    const room: Room = await getRoom(roomId);

    const configurationUrl = await getDeviceUrl(room.id);

    const requests = getRequestList(room.id);

    const statusOk = await makeRequests(configurationUrl, requests);

    if (statusOk) {
      console.log('Alarm device configuration successful');
    } else {
      console.error('Request not successful');
    }
  } catch (err) {
    console.error('An error occured during the configuration of the alarm:', err);
  }
}

const roomId: string = process.argv[0];

if (!roomId) {
  console.error('Please, provide a correct room id');
} else {
  await configureAlarm(roomId);
}

