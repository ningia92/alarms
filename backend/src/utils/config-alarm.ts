import { getDeviceUrl, getParamsList, makeRequests } from './config-utils.js';
import { getRoom } from '../services/room-service.js';

const configureAlarm = async (roomId: string): Promise<void> => {
  try {
    const room: Room = await getRoom(roomId);

    const configurationUrl = await getDeviceUrl(room.id);

    const params = getParamsList(room.id);

    const statusOk = await makeRequests(configurationUrl, params);

    if (statusOk) {
      console.log('Alarm device configuration successful');
    } else {
      console.error('Request not successful');
    }
  } catch (err) {
    console.error('An error occured during the configuration of the alarm:', err);
  }
}

// access the first command-line argument, that should corresponds to room id
const roomId: string = process.argv[2];

if (!roomId) {
  console.error('Please, provide a correct room id');
} else {
  await configureAlarm(roomId);
}

