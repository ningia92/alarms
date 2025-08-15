import React, { useMemo } from 'react';
import type { Room } from '../types';
import BellIcon from './icons/BellIcon';

interface ActiveAlarmsProps {
  rooms: Room[];
  onTurnOff: (roomId: string) => void;
}

const ActiveAlarms: React.FC<ActiveAlarmsProps> = ({ rooms, onTurnOff }) => {
  const activeAlarms = useMemo(() => {
    return rooms
      .filter(room => room.alarm.status === 'on')
      .sort((room1, room2) =>
        new Date(room2.alarm.lastUpdate).valueOf() - new Date(room1.alarm.lastUpdate).valueOf())
  }, [rooms]);

  return (
    <section>
      <h2 className="text-xl font-semibold text-zinc-700 dark:text-zinc-300 mb-4">
        Allarmi Attivi
      </h2>
      <div className={`bg-white dark:bg-zinc-800/50 p-4 rounded-lg shadow-lg border-2 ${activeAlarms.length !== 0 && 'border-danger-500/50 dark:border-danger-500/30'}`}>
        {activeAlarms.length === 0 ? (
          <p className="text-center text-zinc-500 dark:text-zinc-400 py-4">
            Nessun allarme attivo
          </p>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {activeAlarms.map(room => (
              <li
                key={room.id}
                className="flex items-center justify-between p-4 bg-danger-50 dark:bg-danger-500/10 rounded-lg"
              >
                <span className="text-lg font-bold text-danger-700 dark:text-danger-200">
                  {room.type === 'room' ? "Stanza" : "Piscina"} {room.phone}
                </span>

                <div className="flex flex items-center gap-4">
                  <div className="flex items-center text-danger-500 dark:text-danger-400 animate-pulse">
                    <BellIcon className="w-5 h-5 mr-1.5" />
                    <span>
                      {new Date(room.alarm.lastUpdate).getHours()}:
                      {new Date(room.alarm.lastUpdate).getMinutes()}:
                      {new Date(room.alarm.lastUpdate).getSeconds()}
                    </span>
                  </div>
                  <button
                    onClick={() => onTurnOff(room.id)}
                    className="px-4 py-2 text-sm font-bold text-white bg-danger-500 rounded-lg hover:bg-danger-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-danger-50 dark:focus:ring-offset-danger-500/10 focus:ring-danger-500 shrink-0"
                  >
                    Disattiva
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};

export default ActiveAlarms;