import React, { useState } from 'react';
import type { Room } from '../types';
import RoomDetailsModal from './RoomDetailsModal.tsx';
import DeactivationAlarmModal from './DeactivationAlarmModal.tsx';

interface RoomCardProps {
  room: Room;
  onDeactivate: (roomId: string) => void;
}

const RoomCard: React.FC<RoomCardProps> = ({ room, onDeactivate }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isDeactivationAlarmModalOpen, setDeactivationAlarmModalOpen] = useState(false);

  const isOn = room.alarm.status === 'on';
  const isOff = room.alarm.status === 'off';
  const isDown = room.alarm.status === 'down';

  return (
    <>
      <div
        className={`p-4 rounded-lg flex items-center justify-between transition-colors duration-300 ${isOn
          ? 'bg-danger-100 dark:bg-danger-500/15'
          : 'bg-zinc-100 dark:bg-zinc-700/50'
          }`}
      >
        <div className="flex items-center">
          <span
            className={`w-3 h-3 rounded-full mr-3
              ${isOn && 'bg-danger-500' ||
              isOff && 'bg-success-500' ||
              isDown && 'bg-yellow-500'}`}
            title={`Stato: ${isOn && 'Attivo' || isOff && 'Inattivo' || isDown && 'Non raggiungibile'}`}
          ></span>
          <span className="font-medium text-zinc-700 dark:text-zinc-300">
            Camera {room.id}
          </span>
        </div>
        <div className="flex flex-col space-y-2">
          <button
            onClick={() => setModalOpen(true)}
            className="px-3 py-1 text-sm font-semibold text-zinc-200 bg-primary-600 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary-100 dark:focus:ring-offset-zinc-800 focus:ring-primary-500"
          >
            Dettagli
          </button>
          
          {isOn && (
            <button
              onClick={() => setDeactivationAlarmModalOpen(true)}
              className="px-3 py-1 text-sm font-semibold text-white bg-danger-500 rounded-md hover:bg-danger-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-danger-100 dark:focus:ring-offset-zinc-800 focus:ring-danger-500"
            >
              Disattiva
            </button>
          )}
        </div>
      </div>

      {isModalOpen && (
        <RoomDetailsModal
          room={room}
          onClose={() => setModalOpen(false)}
        />
      )}

      {isDeactivationAlarmModalOpen && (
        <DeactivationAlarmModal
          isOpen={isDeactivationAlarmModalOpen}
          room={room}
          onClose={() => setDeactivationAlarmModalOpen(false)}
          onDeactivate={onDeactivate}
        />
      )}
    </>
  );
};

export default RoomCard;