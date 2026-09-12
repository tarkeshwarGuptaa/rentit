import { Link } from 'react-router-dom';
import { FiMapPin, FiHome as FiRoomType } from 'react-icons/fi';
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
    single: 'Single Room',
    shared: 'Shared Room',
    '1BHK': '1 BHK',
    '2BHK': '2 BHK',
  };

  return (
    <Link
      to={`/rooms/${room._id}`}
      className={`group block bg-white rounded-[var(--radius-card)] overflow-hidden transition-all duration-300 hover:shadow-[var(--shadow-card-hover)] ${
        isHighlighted
          ? 'ring-2 ring-primary-500 shadow-[var(--shadow-card-hover)]'
          : 'shadow-[var(--shadow-card)]'
      }`}
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={room.photos?.[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'}
          alt={room.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Availability Badge */}
        {!room.isAvailable && (
          <div className="absolute top-3 left-3 px-3 py-1 bg-red-500/90 text-white text-xs font-medium rounded-[var(--radius-badge)]">
            Occupied
          </div>
        )}

        {/* Room Type Badge */}
        <div className="absolute top-3 right-3 px-3 py-1 glass-dark text-white text-xs font-medium rounded-[var(--radius-badge)]">
          {roomTypeLabels[room.roomType] || room.roomType}
        </div>

        {/* Price Overlay */}
        <div className="absolute bottom-3 left-3 px-3 py-1.5 glass-dark text-white rounded-[var(--radius-input)]">
          <span className="text-lg font-bold">{formatRent(room.rent)}</span>
          <span className="text-white/70 text-xs">/month</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-surface-900 text-base mb-1.5 line-clamp-1 group-hover:text-primary-600 transition-colors">
          {room.title}
        </h3>

        <div className="flex items-center gap-1 text-surface-700/60 text-sm mb-3">
          <FiMapPin className="w-3.5 h-3.5 shrink-0" />
          <span className="line-clamp-1">{room.area}</span>
        </div>

        {/* Amenities */}
        {room.amenities?.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {room.amenities.slice(0, 3).map((amenity) => (
              <AmenityBadge key={amenity} amenity={amenity} size="sm" />
            ))}
            {room.amenities.length > 3 && (
              <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium text-surface-700/50 bg-surface-100 rounded-[var(--radius-badge)]">
                +{room.amenities.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
};

export default RoomCard;
