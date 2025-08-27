import React from 'react';
import type { Room } from '../types';

interface RoomDetailsModalProps {
  room: Room;
  onClose: () => void;
}

const RoomDetailsModal: React.FC<RoomDetailsModalProps> = ({ room, onClose }) => {
  const isActive = room.alarm.status === 'on';
  const roomType = room.type === 'room' ? `Stanza ${String(room.phone).slice(2)}` : "Piscina";
  const lastActivation = new Date(room.alarm.lastActivation).toLocaleString();

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center dark:bg-zinc-900/70 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md p-6 mx-4 bg-white rounded-lg shadow-xl dark:bg-zinc-800"
      >
        <div className="flex items-start justify-between pb-4 border-b border-zinc-200 dark:border-zinc-700">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
            {roomType}
          </h3>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
            aria-label="Chiudi modale"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <div className="mt-4 space-y-3">
          <div className="flex justify-between">
            <span className="font-medium text-zinc-600 dark:text-zinc-400">ID:</span>
            <span className="text-zinc-800 dark:text-zinc-200">{room.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-zinc-600 dark:text-zinc-400">Blocco:</span>
            <span className="text-zinc-800 dark:text-zinc-200">{room.type === 'room' ? room.block : '-'}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-zinc-600 dark:text-zinc-400">Telefono:</span>
            <span className="text-zinc-800 dark:text-zinc-200">{room.type === 'room' ? room.phone : '-'}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-zinc-600 dark:text-zinc-400">Stato allarme:</span>
            <span className={`px-2 py-1 text-xs font-bold rounded-full ${isActive
              ? 'bg-danger-100 text-danger-800 dark:bg-danger-500/20 dark:text-danger-300'
              : 'bg-success-100 text-success-800 dark:bg-success-500/20 dark:text-success-300'
              }`}
            >
              {isActive ? 'ATTIVO' : 'INATTIVO'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-zinc-600 dark:text-zinc-400">Ultimo allarme:</span>
            <span className="text-zinc-800 dark:text-zinc-200">{room.alarm.lastActivation ? lastActivation : '-'}</span>
          </div>
        </div>

        <div className="pt-4 mt-4 text-right border-t border-zinc-200 dark:border-zinc-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-white bg-primary-800 rounded-md hover:bg-primary-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary-500 dark:focus:ring-offset-primary-500/15 focus:ring-primary-900"
          >
            Chiudi
          </button>
        </div>
      </div>
    </div>
  )
}

export default RoomDetailsModal;