import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import api from '../utils/api';
import AmenityBadge from '../components/ui/AmenityBadge';
import Loader from '../components/ui/Loader';
import ErrorState from '../components/common/ErrorState';
import {
  FiMapPin,
  FiPhone,
  FiArrowLeft,
  FiUser,
  FiEye,
  FiCalendar,
} from 'react-icons/fi';
import { IoLogoWhatsapp } from 'react-icons/io5';

// Fix marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const RoomDetailPage = () => {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activePhoto, setActivePhoto] = useState(0);

  const fetchRoom = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.get(`/rooms/${id}`);
      setRoom(data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load room details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoom();
  }, [id]);

  const formatRent = (amount) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

  const roomTypeLabels = {
    single: 'Single Room',
    shared: 'Shared Room',
    '1BHK': '1 BHK Apartment',
    '2BHK': '2 BHK Apartment',
  };

  if (loading) return <Loader type="detail" />;
  if (error) return <ErrorState message={error} onRetry={fetchRoom} />;
  if (!room) return <ErrorState message="Room not found" />;

  const whatsappLink = `https://wa.me/91${room.landlord?.phone}?text=${encodeURIComponent(
    `Hi, I'm interested in your room listing "${room.title}" on RoomNear. Is it still available?`
  )}`;

  return (
    <>
      <Helmet>
        <title>{room.title} — {formatRent(room.rent)}/month | RoomNear</title>
        <meta name="description" content={`${room.title} in ${room.area} - ${formatRent(room.rent)}/month. ${room.description?.slice(0, 150)}...`} />
      </Helmet>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 animate-fade-in">
        {/* Back */}
        <Link
          to="/listings"
          className="inline-flex items-center gap-2 text-surface-700/60 hover:text-surface-900 text-sm font-medium mb-5 transition-colors"
        >
          <FiArrowLeft className="w-4 h-4" />
          Back to listings
        </Link>

        {/* Photo Gallery — Airbnb Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-8 rounded-[var(--radius-card)] overflow-hidden">
          {/* Main Photo */}
          <div
            className="aspect-[4/3] md:aspect-auto md:row-span-2 cursor-pointer overflow-hidden"
            onClick={() => setActivePhoto(0)}
          >
            <img
              src={room.photos?.[activePhoto] || room.photos?.[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'}
              alt={room.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>

          {/* Side Photos */}
          <div className="hidden md:grid grid-cols-2 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="aspect-[4/3] cursor-pointer overflow-hidden"
                onClick={() => room.photos?.[i] && setActivePhoto(i)}
              >
                {room.photos?.[i] ? (
                  <img
                    src={room.photos[i]}
                    alt={`${room.title} ${i + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-surface-200 flex items-center justify-center text-surface-700/30 text-sm">
                    No photo
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Mobile Photo Dots */}
          {room.photos?.length > 1 && (
            <div className="flex justify-center gap-2 py-2 md:hidden col-span-full">
              {room.photos.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActivePhoto(i)}
                  className={`w-2 h-2 rounded-full transition-colors cursor-pointer ${
                    i === activePhoto ? 'bg-primary-600' : 'bg-surface-300'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title & Meta */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className={`px-3 py-1 text-xs font-medium rounded-[var(--radius-badge)] ${
                  room.isAvailable
                    ? 'bg-green-50 text-green-700'
                    : 'bg-red-50 text-red-600'
                }`}>
                  {room.isAvailable ? 'Available' : 'Occupied'}
                </span>
                <span className="px-3 py-1 text-xs font-medium rounded-[var(--radius-badge)] bg-surface-100 text-surface-700">
                  {roomTypeLabels[room.roomType]}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-surface-900 mb-3 font-[var(--font-display)]">
                {room.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-surface-700/60">
                <span className="flex items-center gap-1.5">
                  <FiMapPin className="w-4 h-4" />
                  {room.area} — {room.address}
                </span>
                <span className="flex items-center gap-1.5">
                  <FiEye className="w-4 h-4" />
                  {room.views} views
                </span>
                <span className="flex items-center gap-1.5">
                  <FiCalendar className="w-4 h-4" />
                  Listed {formatDate(room.createdAt)}
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-primary-600">
                {formatRent(room.rent)}
              </span>
              <span className="text-surface-700/60">/month</span>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-lg font-semibold text-surface-900 mb-3">About this room</h2>
              <p className="text-surface-700/70 leading-relaxed whitespace-pre-line">
                {room.description}
              </p>
            </div>

            {/* Amenities */}
            {room.amenities?.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-surface-900 mb-3">Amenities</h2>
                <div className="flex flex-wrap gap-2">
                  {room.amenities.map((amenity) => (
                    <AmenityBadge key={amenity} amenity={amenity} size="md" />
                  ))}
                </div>
              </div>
            )}

            {/* Mini Map */}
            {room.location?.lat && room.location?.lng && (
              <div>
                <h2 className="text-lg font-semibold text-surface-900 mb-3">Location</h2>
                <div className="h-64 rounded-[var(--radius-card)] overflow-hidden">
                  <MapContainer
                    center={[room.location.lat, room.location.lng]}
                    zoom={15}
                    className="w-full h-full"
                    scrollWheelZoom={false}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; OSM'
                    />
                    <Marker position={[room.location.lat, room.location.lng]} />
                  </MapContainer>
                </div>
              </div>
            )}
          </div>

          {/* Right: Contact Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white border border-surface-200 rounded-[var(--radius-card)] p-6 shadow-[var(--shadow-card)]">
              <h3 className="text-lg font-semibold text-surface-900 mb-4">
                Contact Landlord
              </h3>

              {/* Landlord Info */}
              <div className="flex items-center gap-3 mb-5 p-3 bg-surface-50 rounded-[var(--radius-input)]">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <FiUser className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <p className="font-semibold text-surface-900">
                    {room.landlord?.name || 'Landlord'}
                  </p>
                  <p className="text-sm text-surface-700/60">Property Owner</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-3 mb-4 text-surface-700">
                <FiPhone className="w-5 h-5 text-surface-700/50" />
                <a
                  href={`tel:+91${room.landlord?.phone}`}
                  className="font-medium hover:text-primary-600 transition-colors"
                >
                  +91 {room.landlord?.phone}
                </a>
              </div>

              {/* WhatsApp CTA */}
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 bg-[#25D366] text-white rounded-[var(--radius-button)] font-semibold text-base hover:bg-[#20BD5A] transition-all hover:shadow-lg hover:shadow-[#25D366]/25 hover:-translate-y-0.5"
              >
                <IoLogoWhatsapp className="w-5 h-5" />
                Contact on WhatsApp
              </a>

              <p className="text-xs text-surface-700/40 text-center mt-3">
                Free to contact • No brokerage
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RoomDetailPage;
