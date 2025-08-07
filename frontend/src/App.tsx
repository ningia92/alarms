import React, { useState, useEffect, useCallback } from 'react';
import { type Room, AlarmStatus } from './types';
import Header from './components/Header';
import Summary from './components/Summary';
import ActiveAlarms from './components/ActiveAlarms';
import RoomList from './components/RoomList';

const TOTAL_ROOMS = 75;
const ACTIVE_ALARM_IDS = [5, 12, 28, 45, 61, 72]; // Pre-defined active alarms

const generateInitialRooms = (): Room[] => {
  return Array.from({ length: TOTAL_ROOMS }, (_, i) => {
    const roomId = i + 1;
    return {
      id: roomId,
      name: `Camera ${roomId}`,
      status: ACTIVE_ALARM_IDS.includes(roomId) ? AlarmStatus.Active : AlarmStatus.Inactive,
    };
  });
};

const App: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    setRooms(generateInitialRooms());
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;

    if (theme === 'dark')
      root.classList.add('dark')
    else
      root.classList.remove('dark');

    localStorage.setItem('theme', theme);

  }, [theme]);

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  const handleDeactivateAlarm = useCallback((roomId: number) => {
    setRooms(rooms =>
      rooms.map(room =>
        room.id === roomId
          ? { ...room, status: AlarmStatus.Inactive }
          : room
      )
    );
  }, []);

  return (
    <div className='min-h-screen bg-slate-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100'>
      <Header theme={theme} toggleTheme={toggleTheme} />
      <main className='container mx-auto p-4 sm:p-6 lg:p-8'>
        <div className='flex flex-col gap-8'>
          <Summary rooms={rooms} />
          <ActiveAlarms rooms={rooms} onDeactivate={handleDeactivateAlarm} />
          <RoomList rooms={rooms} onDeactivate={handleDeactivateAlarm} />
        </div>
      </main>
      <footer className="text-center py-4 text-slate-500 dark:text-slate-400 text-sm">
        <p>Applicazione Gestione Allarmi © {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default App
