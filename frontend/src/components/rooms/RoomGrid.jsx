import RoomCard from './RoomCard';
import { FiInbox } from 'react-icons/fi';

const RoomGrid = ({ rooms, highlightedId }) => {
  if (rooms.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <div className="w-16 h-16 bg-surface-100 rounded-full flex items-center justify-center mb-4">
          <FiInbox className="w-8 h-8 text-surface-700/40" />
        </div>
        <h3 className="text-lg font-semibold text-surface-900 mb-1">No rooms found</h3>
        <p className="text-surface-700/60 text-sm text-center max-w-sm">
          Try adjusting your filters or search for a different area
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 stagger-children">
      {rooms.map((room) => (
        <RoomCard
          key={room._id}
          room={room}
          isHighlighted={room._id === highlightedId}
        />
      ))}
    </div>
  );
};

export default RoomGrid;
