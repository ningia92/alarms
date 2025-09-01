import React, { useState, useEffect } from 'react';
import type { Room } from '../types';

const DEACTIVATION_REASONS = [
  'Falso allarme',
  'Intervento del personale autorizzato',
  'Tentativo di risoluzione da reception',
  'Allarme risolto da manutentore',
];

interface DeactivationAlarmModalProps {
  isOpen: boolean;
  room: Room;
  onClose: () => void;
  onDeactivate: (roomId: string, reason: string) => void;
}

const DeactivationAlarmModal: React.FC<DeactivationAlarmModalProps> = ({ isOpen, room, onClose, onDeactivate }) => {
  const [selectedReason, setSelectedReason] = useState<string>('');

  useEffect(() => {
    if (!isOpen) {
      setSelectedReason('')
    }
  }, [isOpen]);

  const handleDeactivate = () => {
    if (room && selectedReason) {
      onDeactivate(room.id, selectedReason);
      onClose();
    }
  }

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
          <div>
            <h2 id="modal-title" className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
              Disattiva Allarme
            </h2>
            <p className="mt-1 text-md text-zinc-600 dark:text-zinc-400">
              Stai per disattivare l'allarme per la stanza <span className="font-semibold text-danger-400">{room.id}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
            aria-label="Chiudi modale"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <div className="mt-4 space-y-3">
          <fieldset>
            <legend className="text-md font-medium text-zinc-800 dark:text-zinc-200 mb-3">
              Seleziona una motivazione:
            </legend>
            <div className="space-y-3">
              {DEACTIVATION_REASONS.map((reason) => (
                <label
                  key={reason}
                  htmlFor={reason}
                  className="flex items-center p-3 rounded-lg cursor-pointer transition-colors duration-200 bg-zinc-50 dark:bg-zinc-900/50 hover:bg-zinc-200 dark:hover:bg-zinc-700/50 border border-zinc-200 dark:border-zinc-700 has-[:checked]:bg-primary-50 has-[:checked]:dark:bg-primary-500/10 has-[:checked]:border-primary-500"
                >
                  <input
                    type="radio"
                    id={reason}
                    name="deactivation-reason"
                    value={reason}
                    checked={selectedReason === reason}
                    onChange={(e) => setSelectedReason(e.target.value)}
                    className="h-4 w-4 text-primary-600 border border-zinc-200 dark:border-zinc-700/50 focus:ring-primary-500"
                  />
                  <span className="ml-3 text-sm font-medium text-zinc-700 dark:text-zinc-300">{reason}</span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <button
            onClick={onClose}
            type="button"
            className="px-4 py-2 text-sm font-semibold text-zinc-700 dark:text-zinc-200 bg-white dark:bg-zinc-700 border border-zinc-300 dark:border-zinc-600 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-zinc-800 focus:ring-zinc-400"
          >
            Annulla
          </button>
          <button
            onClick={handleDeactivate}
            type="button"
            disabled={!selectedReason}
            className="px-4 py-2 text-sm font-semibold text-white bg-danger-500 rounded-lg hover:bg-danger-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-zinc-800 focus:ring-danger-500 disabled:bg-danger-300 dark:disabled:bg-danger-400 disabled:cursor-not-allowed"
          >
            Conferma Disattivazione
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeactivationAlarmModal;