import React, { useState, useEffect, useRef } from 'react';
import type { Room } from './types';
import Header from './components/Header';
import Summary from './components/Summary';
import ActiveAlarms from './components/ActiveAlarms';
import RoomList from './components/RoomList';

const App: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  // utilize useRef to mantain the WebSocket instance without re-render
  const webSocket = useRef<WebSocket | null>(null);

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
    // function that establishes the connection to server
    const connect = () => {
      const ws = new WebSocket('ws://localhost:3000');

      ws.onopen = () => {
        console.log('Connected to WebSocket Server');
      }

      ws.onmessage = event => {
        try {
          const msg = JSON.parse(event.data);

          if (msg.type === 'room_list' && msg.rooms) {
            setRooms(msg.rooms);
          } else if (msg.type === 'alarm_on' && msg.roomId) {
            setRooms(rooms => rooms.map(room => {
              return room.id === msg.roomId
                ? {
                  ...room,
                  alarm: {
                    ...room.alarm,
                    status: msg.status,
                    lastActivation: new Date(msg.lastActivation)
                  }
                }
                : room;
            }));
          } else if (msg.type === 'error') {
            console.log(msg.info);
          }
        } catch (err) {
          console.error('Invalid WebSocket message', err);
        }
      };

      ws.onerror = (err) => console.error('WebSocket error', err);

      // when the connection is closed, try to reconnect after 3 seconds
      // the timeout is used to avoid overloading the server
      ws.onclose = () => {
        console.log('Connection to WebSocket Server closed. Reconnecting...');

        setTimeout(() => {
          connect();
        }, 3000);
      };

      // save the instance in the ref
      webSocket.current = ws;
    };

    connect();

    // clean function: closes the connection when the component is disassembled
    return () => {
      if (webSocket.current && webSocket.current.readyState === WebSocket.OPEN) {
        webSocket.current.close();
      }
    }
  }, []);

  const handleTurnOffAlarm = (roomId: string) => {
    const message = { type: 'alarm_off', roomId };

    if (webSocket.current && webSocket.current.readyState === WebSocket.OPEN) {
      webSocket.current.send(JSON.stringify(message));
    }
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
