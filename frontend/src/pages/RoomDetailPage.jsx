import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRoomById, clearRoomDetail, selectRoom, selectRoomDetailLoading, selectRoomDetailError } from '../store/slices/roomDetailSlice';
import AmenityBadge from '../components/ui/AmenityBadge';
import Loader from '../components/ui/Loader';
import ErrorState from '../components/common/ErrorState';
import { FiMapPin, FiPhone, FiArrowLeft, FiUser, FiEye, FiCalendar } from 'react-icons/fi';
import { IoLogoWhatsapp } from 'react-icons/io5';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const formatRent = (amount) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

const formatDate = (date) =>
  new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

const roomTypeLabels = {
  single: 'Single Room', shared: 'Shared Room', '1BHK': '1 BHK Apartment', '2BHK': '2 BHK Apartment',
};

const RoomDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const room = useSelector(selectRoom);
  const loading = useSelector(selectRoomDetailLoading);
  const error = useSelector(selectRoomDetailError);
  const [activePhoto, setActivePhoto] = useState(0);

  useEffect(() => {
    dispatch(fetchRoomById(id));
    return () => dispatch(clearRoomDetail());
  }, [dispatch, id]);

  if (loading) return <Loader type="detail" />;
  if (error) return <ErrorState message={error} onRetry={() => dispatch(fetchRoomById(id))} />;
  if (!room) return null;

  const whatsappLink = `https://wa.me/91${room.landlord?.phone}?text=${encodeURIComponent(
    `Hi, I'm interested in your room listing "${room.title}" on rentIt. Is it still available?`
  )}`;

  return (
    <>
      <Helmet>
        <title>{room.title} — {formatRent(room.rent)}/month | rentIt</title>
        <meta name="description" content={`${room.title} in ${room.area} - ${formatRent(room.rent)}/month. ${room.description?.slice(0, 150)}...`} />
      </Helmet>

      <div className="px-4 sm:px-6 lg:px-10 py-6 animate-fade-in">
        <Link to="/listings"
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-900 text-sm font-medium mb-5 transition-colors">
          <FiArrowLeft className="w-4 h-4" /> Back to listings
        </Link>

        {/* Photo Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-8 rounded-2xl overflow-hidden">
          <div className="aspect-[4/3] md:aspect-auto md:row-span-2 cursor-pointer overflow-hidden"
            onClick={() => setActivePhoto(0)}>
            <img
              src={room.photos?.[activePhoto] || room.photos?.[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'}
              alt={room.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="hidden md:grid grid-cols-2 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-[4/3] cursor-pointer overflow-hidden"
                onClick={() => room.photos?.[i] && setActivePhoto(i)}>
                {room.photos?.[i] ? (
                  <img src={room.photos[i]} alt={`${room.title} ${i + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                ) : (
                  <div className="w-full h-full bg-zinc-200 flex items-center justify-center text-zinc-400 text-sm">
                    No photo
                  </div>
                )}
              </div>
            ))}
          </div>
          {room.photos?.length > 1 && (
            <div className="flex justify-center gap-2 py-2 md:hidden col-span-full">
              {room.photos.map((_, i) => (
                <button key={i} onClick={() => setActivePhoto(i)}
                  className={`w-2 h-2 rounded-full transition-colors cursor-pointer ${i === activePhoto ? 'bg-indigo-600' : 'bg-zinc-300'}`} />
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Details */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${room.isAvailable ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                  {room.isAvailable ? 'Available' : 'Occupied'}
                </span>
                <span className="px-3 py-1 text-xs font-medium rounded-full bg-zinc-100 text-zinc-700">
                  {roomTypeLabels[room.roomType]}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 mb-3 font-display">
                {room.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-400">
                <span className="flex items-center gap-1.5"><FiMapPin className="w-4 h-4 text-indigo-400" />{room.area} — {room.address}</span>
                <span className="flex items-center gap-1.5"><FiEye className="w-4 h-4" />{room.views} views</span>
                <span className="flex items-center gap-1.5"><FiCalendar className="w-4 h-4" />Listed {formatDate(room.createdAt)}</span>
              </div>
            </div>

            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-indigo-600">{formatRent(room.rent)}</span>
              <span className="text-zinc-400">/month</span>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-zinc-900 mb-3">About this room</h2>
              <p className="text-zinc-700 leading-relaxed whitespace-pre-line">{room.description}</p>
            </div>

            {room.amenities?.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-zinc-900 mb-3">Amenities</h2>
                <div className="flex flex-wrap gap-2">
                  {room.amenities.map((amenity) => <AmenityBadge key={amenity} amenity={amenity} size="md" />)}
                </div>
              </div>
            )}

            {room.location?.lat && room.location?.lng && (
              <div>
                <h2 className="text-lg font-semibold text-zinc-900 mb-3">Location</h2>
                <div className="h-64 rounded-2xl overflow-hidden">
                  <MapContainer center={[room.location.lat, room.location.lng]} zoom={15}
                    className="w-full h-full" scrollWheelZoom={false}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OSM" />
                    <Marker position={[room.location.lat, room.location.lng]} />
                  </MapContainer>
                </div>
              </div>
            )}
          </div>

          {/* Right: Contact Card */}
          <div>
            <div className="sticky top-24 bg-white border border-zinc-200 rounded-2xl p-6"
              style={{ boxShadow: 'var(--shadow-card)' }}>
              <h3 className="text-lg font-semibold text-zinc-900 mb-4">Contact Landlord</h3>
              <div className="flex items-center gap-3 mb-5 p-3 bg-zinc-50 rounded-lg">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                  <FiUser className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <p className="font-semibold text-zinc-900">{room.landlord?.name || 'Landlord'}</p>
                  <p className="text-sm text-zinc-400">Property Owner</p>
                </div>
              </div>
              <div className="flex items-center gap-3 mb-4 text-zinc-700">
                <FiPhone className="w-5 h-5 text-zinc-400" />
                <a href={`tel:+91${room.landlord?.phone}`}
                  className="font-medium hover:text-indigo-600 transition-colors">
                  +91 {room.landlord?.phone}
                </a>
              </div>
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold text-base text-white hover:opacity-90 transition-all"
                style={{ background: '#25D366', boxShadow: '0 4px 14px rgba(37,211,102,0.3)' }}>
                <IoLogoWhatsapp className="w-5 h-5" />
                Contact on WhatsApp
              </a>
              <p className="text-xs text-zinc-400 text-center mt-3">Free to contact • No brokerage</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RoomDetailPage;
