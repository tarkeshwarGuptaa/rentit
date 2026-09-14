import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default marker icon issue with bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom marker icon
const createCustomIcon = (isHighlighted = false) =>
  L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      width: ${isHighlighted ? '32px' : '26px'};
      height: ${isHighlighted ? '32px' : '26px'};
      background: ${isHighlighted ? '#2563eb' : '#3b82f6'};
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      transition: all 0.2s ease;
      ${isHighlighted ? 'transform: scale(1.2);' : ''}
    "></div>`,
    iconSize: [isHighlighted ? 32 : 26, isHighlighted ? 32 : 26],
    iconAnchor: [isHighlighted ? 16 : 13, isHighlighted ? 16 : 13],
    popupAnchor: [0, -16],
  });

// IIT Delhi center
const DEFAULT_CENTER = [28.5459, 77.1926];
const DEFAULT_ZOOM = 14;

const FlyToRoom = ({ room }) => {
  const map = useMap();

  useEffect(() => {
    if (room?.location) {
      map.flyTo([room.location.lat, room.location.lng], 16, {
        duration: 0.8,
      });
    }
  }, [room, map]);

  return null;
};

const formatRent = (amount) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);

const RoomMap = ({ rooms = [], highlightedRoom = null, onMarkerClick, className = '' }) => {
  return (
    <div className={`rounded-2xl overflow-hidden ${className}`}>
      <MapContainer
        center={DEFAULT_CENTER}
        zoom={DEFAULT_ZOOM}
        className="w-full h-full min-h-[400px]"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {highlightedRoom && <FlyToRoom room={highlightedRoom} />}

        {rooms.map((room) => {
          if (!room.location?.lat || !room.location?.lng) return null;

          return (
            <Marker
              key={room._id}
              position={[room.location.lat, room.location.lng]}
              icon={createCustomIcon(highlightedRoom?._id === room._id)}
              eventHandlers={{
                click: () => onMarkerClick?.(room),
              }}
            >
              <Popup>
                <div className="min-w-[200px]">
                  <img
                    src={room.photos?.[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400'}
                    alt={room.title}
                    className="w-full h-28 object-cover rounded-md mb-2"
                  />
                  <h4 className="font-semibold text-sm text-gray-900 mb-1">
                    {room.title}
                  </h4>
                  <p className="text-indigo-600 font-bold text-sm mb-2">
                    {formatRent(room.rent)}/month
                  </p>
                  <Link
                    to={`/rooms/${room._id}`}
                    className="inline-block text-xs text-indigo-600 font-medium hover:underline"
                  >
                    View Details →
                  </Link>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default RoomMap;
