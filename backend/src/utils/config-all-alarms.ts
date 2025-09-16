import { getDeviceUrl, getParamsList, makeRequests } from './config-utils.js';
import { getRoomList } from '../services/room-service.js';

// configure the behaviors of the alarms when they're activated
// it is used when and alarm device goes off or is replaced with an unconfigured one
const configureAlarms = async (): Promise<void> => {
  try {
    const rooms: Room[] = await getRoomList();

    for (const room of rooms) {
      const configurationUrl = await getDeviceUrl(room.id);

      const params = getParamsList(room.id);

      const statusOk = await makeRequests(configurationUrl, params);

      if (statusOk) {
        console.log('Alarm device configuration successful');
      } else {
        console.error('One or more requests were not successful');
      }
    }
  } catch (err) {
    console.error('An error occured during the configuration of all alarms:', err);
  }
}

await configureAlarms();