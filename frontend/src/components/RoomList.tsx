import React from 'react';
import { type Room } from '../types';
import Accordion from './Accordion';
import RoomCard from './RoomCard';

interface RoomListProps {
  rooms: Room[];
  onDeactivate: (roomId: string) => void;
}

const RoomList: React.FC<RoomListProps> = ({ rooms, onDeactivate }) => {
  const pool = rooms.filter(room => room.type === 'pool');
  const block11 = rooms.filter(room => room.block === '11');
  const block12 = rooms.filter(room => room.block === '12');
  const block13 = rooms.filter(room => room.block === '13');
  const block14 = rooms.filter(room => room.block === '14');

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
        <Accordion title="Blocco 11">
          {renderRoomGrid(block11)}
        </Accordion>
        <Accordion title="Blocco 12">
          {renderRoomGrid(block12)}
        </Accordion>
        <Accordion title="Blocco 13">
          {renderRoomGrid(block13)}
        </Accordion>
        <Accordion title="Blocco 14">
          {renderRoomGrid(block14)}
        </Accordion>
        <Accordion title="Piscina">
          {renderRoomGrid(pool)}
        </Accordion>
      </div>
    </section>
  )
}

export default RoomList;