import React, { useState, useEffect } from 'react';
import axios from 'axios';
import type { Room } from './types';
import Header from './components/Header';
import Summary from './components/Summary';
import ActiveAlarms from './components/ActiveAlarms';
import RoomList from './components/RoomList';

const App: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    const root = window.document.documentElement;

    if (theme === 'dark')
      root.classList.add('dark')
    else
      root.classList.remove('dark');

    localStorage.setItem('theme', theme);

  }, [theme]);

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  useEffect(() => {
    axios
      .get('http://localhost:3000/api/v1/rooms')
      .then(response => setRooms(response.data))
      .catch(err => console.error(err));
  }, []);

  const handleTurnOffAlarm = (roomId: string) => {
    axios
      .patch(`http://localhost:3000/api/v1/rooms/${roomId}/alarm`, { status: 'off' })
      .then(() => {
        setRooms(rooms => rooms.map(room => {
          return room.id === roomId
            ? { ...room, alarm: { ...room.alarm, status: 'off' } }
            : room
        }))
      })
  }

  return (
    <div className='min-h-screen bg-slate-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100'>
      <Header theme={theme} toggleTheme={toggleTheme} />
      <main className='container mx-auto p-4 sm:p-6 lg:p-8'>
        <div className='flex flex-col gap-8'>
          <Summary rooms={rooms} />
          <ActiveAlarms rooms={rooms} onTurnOff={handleTurnOffAlarm} />
          <RoomList rooms={rooms} onDeactivate={handleTurnOffAlarm} />
        </div>
      </main>
      <footer className="text-center py-4 text-slate-500 dark:text-slate-400 text-sm">
        <p>Dashboard Allarmi VOI hotels © {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default App
