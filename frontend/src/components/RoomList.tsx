import React from 'react';
import { type Room } from '../types';
import Accordion from './Accordion';
import RoomCard from './RoomCard';

interface RoomListProps {
  rooms: Room[];
  onDeactivate: (roomId: string) => void;
}

const RoomList: React.FC<RoomListProps> = ({ rooms, onDeactivate }) => {
  const block1 = rooms.filter(room => room.block === '1');
  const block2 = rooms.filter(room => room.block === '2');
  const block3 = rooms.filter(room => room.block === '3');
  const block4 = rooms.filter(room => room.block === '4');

  const renderRoomGrid = (blockOfRooms: Room[]) => {
    blockOfRooms.sort((room1, room2) => room1.phone - room2.phone)

    return < div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3' >
      {
        blockOfRooms.map(room => (
          <RoomCard key={room.id} room={room} onDeactivate={onDeactivate} />
        ))
      }
    </div >
  }

  return (
    <section>
      <h2 className="text-xl font-semibold text-zinc-700 dark:text-zinc-300 mb-4">
        Elenco Camere
      </h2>
      <div className="space-y-4">
        <Accordion title="Blocco 1">
          {renderRoomGrid(block1)}
        </Accordion>
        <Accordion title="Blocco 2">
          {renderRoomGrid(block2)}
        </Accordion>
        <Accordion title="Blocco 3">
          {renderRoomGrid(block3)}
        </Accordion>
        <Accordion title="Blocco 4">
          {renderRoomGrid(block4)}
        </Accordion>
      </div>
    </section>
  )
}

export default RoomList;