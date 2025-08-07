import React from 'react';
import { type Room, AlarmStatus } from '../types';
import BuildingIcon from './icons/BuildingIcon';
import AlertTriangleIcon from './icons/AlertTriangleIcon';
import ShieldCheckIcon from './icons/ShieldCheckIcon';

interface SummaryProps {
  rooms: Room[];
}

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  iconContainerClass: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, iconContainerClass }) => (
  <div className={`bg-white dark:bg-zinc-800/50 p-3 rounded-xl shadow-lg ${title === 'Allarmi Attivi' && value > 0 ? 'border-2 border-danger-500/50 dark:border-danger-500/30' : 'border border-zinc-200 dark:border-zinc-700/50'}`}>
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-md font-medium text-zinc-500 dark:text-zinc-400">{title}</p>
        <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mt-1">{value}</p>
      </div>
      <div className={`flex-shrink-0 p-2 rounded-full ${iconContainerClass}`}>
        {icon}
      </div>
    </div>
  </div>
);

const Summary: React.FC<SummaryProps> = ({ rooms }) => {
  const totalRooms = rooms.length;
  const activeAlarmsCount = rooms.filter(room => room.status === AlarmStatus.Active).length;
  const safeRoomsCount = totalRooms - activeAlarmsCount;

  return (
    <section>
      <h2 className="text-xl font-semibold text-zinc-700 dark:text-zinc-300 mb-4">
        Riepilogo
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          title="Camere Totali"
          value={totalRooms}
          icon={<BuildingIcon className="w-7 h-7 text-primary-600 dark:text-primary-400" />}
          iconContainerClass="bg-primary-100 dark:bg-primary-500/10"
        />
        <StatCard
          title="Allarmi Attivi"
          value={activeAlarmsCount}
          icon={<AlertTriangleIcon className="w-7 h-7 text-danger-500 dark:text-danger-400" />}
          iconContainerClass="bg-danger-100 dark:bg-danger-500/10"
        />
        <StatCard
          title="Camere Sicure"
          value={safeRoomsCount}
          icon={<ShieldCheckIcon className="w-7 h-7 text-success-500 dark:text-success-400" />}
          iconContainerClass="bg-success-100 dark:bg-success-500/10"
        />
      </div>
    </section>
  )
}

export default Summary;
