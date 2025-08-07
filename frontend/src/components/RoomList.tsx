import React from 'react';
import { type Room } from '../types';
import Accordion from './Accordion';
import RoomCard from './RoomCard';

interface RoomListProps {
  rooms: Room[];
  onDeactivate: (roomId: number) => void;
}

const RoomList: React.FC<RoomListProps> = ({ rooms, onDeactivate }) => {
  const roomsPerSection = 25;
  const section1 = rooms.slice(0, roomsPerSection);
  const section2 = rooms.slice(roomsPerSection, roomsPerSection * 2);
  const section3 = rooms.slice(roomsPerSection * 2, roomsPerSection * 3);

  const renderRoomGrid = (sectionRooms: Room[]) => (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3'>
      {sectionRooms.map(room => (
        <RoomCard key={room.id} room={room} onDeactivate={onDeactivate} />
      ))}
    </div>
  )

  return (
    <section>
      <h2 className="text-xl font-semibold text-zinc-700 dark:text-zinc-300 mb-4">
        Elenco Camere
      </h2>
      <div className="space-y-4">
        <Accordion title="Camere 1-25">
          {renderRoomGrid(section1)}
        </Accordion>
        <Accordion title="Camere 26-50">
          {renderRoomGrid(section2)}
        </Accordion>
        <Accordion title="Camere 51-75">
          {renderRoomGrid(section3)}
        </Accordion>
      </div>
    </section>
  )
}

export default RoomList;