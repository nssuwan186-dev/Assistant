import React from 'react';
import { Room } from '../types';

interface RoomStatusCardProps {
  room: Room;
}

const RoomStatusCard: React.FC<RoomStatusCardProps> = ({ room }) => {
  const isAvailable = room.status === 'ว่าง';

  const getRoomTypeAbbreviation = (type: 'Standard' | 'Standard Twin'): string => {
    switch (type) {
      case 'Standard':
        return 'STD';
      case 'Standard Twin':
        return 'TWN';
      default:
        return type;
    }
  };

  return (
    <div className={`bg-white rounded-md shadow-sm overflow-hidden transition-transform transform hover:-translate-y-0.5 w-full border-l-4 ${isAvailable ? 'border-green-500' : 'border-red-500'}`}>
      <div className="py-1.5 pr-1.5 pl-2">
        <h3 className="text-sm font-bold text-gray-800 leading-tight">{room.number}</h3>
        <p className="text-gray-500 text-[10px] mt-0">{getRoomTypeAbbreviation(room.type)}</p>
      </div>
    </div>
  );
};

export default RoomStatusCard;