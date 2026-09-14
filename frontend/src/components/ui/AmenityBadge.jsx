import {
  FiWifi,
  FiWind,
  FiDroplet,
  FiTruck,
  FiShoppingBag,
} from 'react-icons/fi';
import {
  MdOutlineLocalLaundryService,
  MdOutlineBathtub,
  MdOutlineFreeBreakfast,
} from 'react-icons/md';

const amenityConfig = {
  WiFi: { icon: FiWifi, color: 'bg-blue-50 text-blue-600' },
  AC: { icon: FiWind, color: 'bg-cyan-50 text-cyan-600' },
  Food: { icon: MdOutlineFreeBreakfast, color: 'bg-orange-50 text-orange-600' },
  Parking: { icon: FiTruck, color: 'bg-green-50 text-green-600' },
  Laundry: { icon: MdOutlineLocalLaundryService, color: 'bg-purple-50 text-purple-600' },
  Geyser: { icon: FiDroplet, color: 'bg-rose-50 text-rose-600' },
  'Attached Bathroom': { icon: MdOutlineBathtub, color: 'bg-teal-50 text-teal-600' },
};

const AmenityBadge = ({ amenity, size = 'sm' }) => {
  const config = amenityConfig[amenity];
  if (!config) return null;

  const Icon = config.icon;
  const isSmall = size === 'sm';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${config.color} ${
        isSmall ? 'px-2.5 py-1 text-xs' : 'px-3 py-1.5 text-sm'
      }`}
    >
      <Icon className={isSmall ? 'w-3 h-3' : 'w-4 h-4'} />
      {amenity}
    </span>
  );
};

export default AmenityBadge;
