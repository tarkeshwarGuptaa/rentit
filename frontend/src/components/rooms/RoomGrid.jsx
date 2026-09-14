import RoomCard from './RoomCard';
import { FiInbox } from 'react-icons/fi';

const RoomGrid = ({ rooms, highlightedId }) => {
  if (rooms.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mb-4">
          <FiInbox className="w-8 h-8 text-zinc-400" />
        </div>
        <h3 className="text-lg font-semibold text-zinc-900 mb-1">No rooms found</h3>
        <p className="text-zinc-400 text-sm text-center max-w-sm">
          Try adjusting your filters or search for a different area
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {rooms.map((room, i) => (
        // inline animationDelay replaces the .stagger-children CSS class
        <div
          key={room._id}
          className="animate-fade-in-up"
          style={{ animationDelay: `${i * 0.05}s` }}
        >
          <RoomCard room={room} isHighlighted={room._id === highlightedId} />
        </div>
      ))}
    </div>
  );
};

export default RoomGrid;
