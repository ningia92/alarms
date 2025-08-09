import React from 'react';
import type { Room } from '../types';

interface RoomCardProps {
  room: Room;
  onDeactivate: (roomId: string) => void;
}

const RoomCard: React.FC<RoomCardProps> = ({ room, onDeactivate }) => {
  const isActive = room.alarm.status === 'on';
  const roomType = room.type === 'room' ? "Stanza" : "Piscina"

  return (
    <div
      className={`p-4 rounded-lg flex items-center justify-between transition-colors duration-300 ${isActive
          ? 'bg-danger-100 dark:bg-danger-500/15'
          : 'bg-zinc-100 dark:bg-zinc-700/50'
        }`}
    >
      <div className="flex items-center">
        <span
          className={`w-3 h-3 rounded-full mr-3 ${isActive ? 'bg-danger-500' : 'bg-success-500'
            }`}
          title={`Stato: ${isActive ? 'Attivo' : 'Inattivo'}`}
        ></span>
        <span className="font-medium text-zinc-700 dark:text-zinc-300">
          {roomType} {room.phone}
        </span>
      </div>
      {isActive && (
        <button
          onClick={() => onDeactivate(room.id)}
          className="px-3 py-1 text-sm font-semibold text-white bg-danger-500 rounded-md hover:bg-danger-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-danger-100 dark:focus:ring-offset-danger-500/15 focus:ring-danger-500"
        >
          Disattiva
        </button>
      )}
    </div>
  );
};

export default RoomCard;