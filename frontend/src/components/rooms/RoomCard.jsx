import { Link } from 'react-router-dom';
import { FiMapPin } from 'react-icons/fi';
import AmenityBadge from '../ui/AmenityBadge';

const RoomCard = ({ room, isHighlighted = false }) => {
  const formatRent = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const roomTypeLabels = {
    single: 'Single',
    shared: 'Shared',
    '1BHK': '1 BHK',
    '2BHK': '2 BHK',
  };

  return (
    <Link
      to={`/rooms/${room._id}`}
      className={`group block bg-white rounded-2xl overflow-hidden transition-all duration-300 ${
        isHighlighted
          ? 'ring-2 ring-indigo-500 shadow-lg -translate-y-1'
          : 'shadow-sm hover:shadow-lg hover:-translate-y-1'
      }`}
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-[16/10]">
        <img
          src={room.photos?.[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'}
          alt={room.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Dark gradient for text readability */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 55%)' }}
        />

        {/* Top badges */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
          {!room.isAvailable && (
            <span className="px-2.5 py-1 bg-red-500 text-white text-xs font-semibold rounded-full shadow-sm">
              Occupied
            </span>
          )}
          <span
            className="ml-auto px-2.5 py-1 text-white text-xs font-medium rounded-full"
            style={{ background: 'rgba(24,24,27,0.75)', backdropFilter: 'blur(4px)' }}
          >
            {roomTypeLabels[room.roomType] || room.roomType}
          </span>
        </div>

        {/* Price at bottom of image */}
        <div className="absolute bottom-3 left-3">
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-extrabold text-white font-display">
              {formatRent(room.rent)}
            </span>
            <span className="text-white/65 text-xs font-medium">/mo</span>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4">
        {/* Title */}
        <h3 className="font-semibold text-zinc-900 text-[0.925rem] mb-1.5 line-clamp-1 group-hover:text-indigo-600 transition-colors">
          {room.title}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-zinc-400 text-xs mb-3">
          <FiMapPin className="w-3 h-3 shrink-0 text-indigo-400" />
          <span className="line-clamp-1">{room.area}</span>
        </div>

        {/* Amenity badges */}
        {room.amenities?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-3 border-t border-zinc-100">
            {room.amenities.slice(0, 3).map((amenity) => (
              <AmenityBadge key={amenity} amenity={amenity} size="sm" />
            ))}
            {room.amenities.length > 3 && (
              <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium text-zinc-400 bg-zinc-100 rounded-full">
                +{room.amenities.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
};

export default RoomCard;
