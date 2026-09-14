import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import api from '../utils/api';
import toast from 'react-hot-toast';
import {
  FiSave,
  FiUpload,
  FiX,
  FiMapPin,
  FiArrowLeft,
  FiAlertCircle,
} from 'react-icons/fi';

// Fix marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const ROOM_TYPES = ['single', 'shared', '1BHK', '2BHK'];
const AMENITIES = ['WiFi', 'AC', 'Food', 'Parking', 'Laundry', 'Geyser', 'Attached Bathroom'];
const DEFAULT_CENTER = [28.5459, 77.1926];

// Map click handler component
const LocationPicker = ({ onLocationSelect }) => {
  useMapEvents({
    click(e) {
      onLocationSelect({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
};

const AddRoomPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    rent: '',
    address: '',
    area: '',
    roomType: 'single',
    amenities: [],
    location: null,
  });
  const [photos, setPhotos] = useState([]);
  const [existingPhotos, setExistingPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingRoom, setFetchingRoom] = useState(false);
  const [errors, setErrors] = useState({});

  // Fetch room for editing
  useEffect(() => {
    if (editId) {
      const fetchRoom = async () => {
        setFetchingRoom(true);
        try {
          const { data } = await api.get(`/rooms/${editId}`);
          const room = data.data;
          setFormData({
            title: room.title,
            description: room.description,
            rent: room.rent,
            address: room.address,
            area: room.area,
            roomType: room.roomType,
            amenities: room.amenities || [],
            location: room.location,
          });
          setExistingPhotos(room.photos || []);
        } catch {
          toast.error('Failed to load room for editing');
          navigate('/dashboard');
        } finally {
          setFetchingRoom(false);
        }
      };
      fetchRoom();
    }
  }, [editId, navigate]);

  const validate = () => {
    const errs = {};
    if (!formData.title || formData.title.length < 5) errs.title = 'Title must be at least 5 characters';
    if (!formData.description || formData.description.length < 20)
      errs.description = 'Description must be at least 20 characters';
    if (!formData.rent || formData.rent < 500) errs.rent = 'Rent must be at least ₹500';
    if (!formData.address || formData.address.length < 10) errs.address = 'Address must be at least 10 characters';
    if (!formData.area) errs.area = 'Area is required';
    if (!formData.location) errs.location = 'Click the map to set room location';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    const totalPhotos = photos.length + existingPhotos.length + files.length;
    if (totalPhotos > 6) {
      toast.error('Maximum 6 photos allowed');
      return;
    }
    setPhotos((prev) => [...prev, ...files]);
  };

  const removePhoto = (index) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingPhoto = (index) => {
    setExistingPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAmenityToggle = (amenity) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('title', formData.title);
      fd.append('description', formData.description);
      fd.append('rent', formData.rent);
      fd.append('address', formData.address);
      fd.append('area', formData.area);
      fd.append('roomType', formData.roomType);
      fd.append('amenities', JSON.stringify(formData.amenities));
      fd.append('location', JSON.stringify(formData.location));

      photos.forEach((photo) => {
        fd.append('photos', photo);
      });

      if (editId) {
        fd.append('existingPhotos', JSON.stringify(existingPhotos));
        await api.put(`/rooms/${editId}`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Room updated successfully!');
      } else {
        await api.post('/rooms', fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Room listed successfully!');
      }
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to save room';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSelect = useCallback((location) => {
    setFormData((prev) => ({ ...prev, location }));
  }, []);

  if (fetchingRoom) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" />
      </div>
    );
  }

  const inputClass = (field) =>
    `w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all ${
      errors[field]
        ? 'border-red-300 focus:ring-red-500/30'
        : 'border-zinc-200 focus:ring-indigo-500/30 focus:border-indigo-500'
    }`;

  return (
    <>
      <Helmet>
        <title>{editId ? 'Edit Room' : 'List a Room'} — RoomNear</title>
      </Helmet>

      <div className="px-4 sm:px-6 lg:px-10 py-8">
        <button
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center gap-2 text-zinc-700/60 hover:text-zinc-900 text-sm font-medium mb-5 transition-colors cursor-pointer"
        >
          <FiArrowLeft className="w-4 h-4" />
          Back to dashboard
        </button>

        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 mb-8 font-display">
          {editId ? 'Edit Room Listing' : 'List a New Room'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 space-y-5">
            <h2 className="text-lg font-semibold text-zinc-900">Room Details</h2>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1.5">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className={inputClass('title')}
                placeholder="e.g., Cozy Single Room near IIT Gate"
              />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1.5">Description</label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className={inputClass('description')}
                placeholder="Describe your room in detail — furnishing, location perks, rules, etc."
              />
              {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Rent */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1.5">Rent (₹/month)</label>
                <input
                  type="number"
                  value={formData.rent}
                  onChange={(e) => setFormData({ ...formData, rent: e.target.value })}
                  className={inputClass('rent')}
                  placeholder="e.g., 8000"
                />
                {errors.rent && <p className="text-red-500 text-xs mt-1">{errors.rent}</p>}
              </div>

              {/* Room Type */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1.5">Room Type</label>
                <select
                  value={formData.roomType}
                  onChange={(e) => setFormData({ ...formData, roomType: e.target.value })}
                  className={`${inputClass('roomType')} cursor-pointer`}
                >
                  {ROOM_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t === 'single' ? 'Single Room' : t === 'shared' ? 'Shared Room' : t}
                    </option>
                  ))}
                </select>
              </div>

              {/* Area */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1.5">Area / Locality</label>
                <input
                  type="text"
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                  className={inputClass('area')}
                  placeholder="e.g., Ber Sarai"
                />
                {errors.area && <p className="text-red-500 text-xs mt-1">{errors.area}</p>}
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1.5">Full Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className={inputClass('address')}
                placeholder="e.g., 45, Ber Sarai Main Road, near IIT Delhi Gate"
              />
              {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
            </div>
          </div>

          {/* Amenities */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-zinc-900 mb-4">Amenities</h2>
            <div className="flex flex-wrap gap-2.5">
              {AMENITIES.map((amenity) => (
                <button
                  key={amenity}
                  type="button"
                  onClick={() => handleAmenityToggle(amenity)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all cursor-pointer ${
                    formData.amenities.includes(amenity)
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                      : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300'
                  }`}
                >
                  {amenity}
                </button>
              ))}
            </div>
          </div>

          {/* Photos */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-zinc-900 mb-4">Photos</h2>

            {/* Existing photos */}
            {existingPhotos.length > 0 && (
              <div className="flex flex-wrap gap-3 mb-4">
                {existingPhotos.map((url, i) => (
                  <div key={i} className="relative w-28 h-20 rounded-lg overflow-hidden group">
                    <img src={url} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeExistingPhoto(i)}
                      className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <FiX className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* New photos preview */}
            {photos.length > 0 && (
              <div className="flex flex-wrap gap-3 mb-4">
                {photos.map((file, i) => (
                  <div key={i} className="relative w-28 h-20 rounded-lg overflow-hidden group">
                    <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removePhoto(i)}
                      className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <FiX className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Upload button */}
            <label className="flex items-center justify-center gap-2 px-6 py-8 border-2 border-dashed border-zinc-300 rounded-2xl text-zinc-700/50 hover:border-indigo-400 hover:text-indigo-600 transition-colors cursor-pointer">
              <FiUpload className="w-5 h-5" />
              <span className="text-sm font-medium">
                Click to upload photos (max 6, 5MB each)
              </span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Location Map Picker */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-zinc-900 mb-2">Room Location</h2>
            <p className="text-sm text-zinc-700/60 mb-4 flex items-center gap-1.5">
              <FiMapPin className="w-4 h-4" />
              Click on the map to set your room's exact location
            </p>

            {errors.location && (
              <div className="flex items-center gap-1.5 mb-3 text-red-500 text-sm">
                <FiAlertCircle className="w-4 h-4" />
                {errors.location}
              </div>
            )}

            <div className="h-72 rounded-2xl overflow-hidden">
              <MapContainer
                center={formData.location ? [formData.location.lat, formData.location.lng] : DEFAULT_CENTER}
                zoom={14}
                className="w-full h-full"
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; OSM'
                />
                <LocationPicker onLocationSelect={handleLocationSelect} />
                {formData.location && (
                  <Marker position={[formData.location.lat, formData.location.lng]} />
                )}
              </MapContainer>
            </div>

            {formData.location && (
              <p className="text-xs text-zinc-700/50 mt-2">
                📍 {formData.location.lat.toFixed(6)}, {formData.location.lng.toFixed(6)}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:shadow-lg hover:shadow-indigo-600/25"
          >
            <FiSave className="w-5 h-5" />
            {loading ? 'Saving...' : editId ? 'Update Listing' : 'Publish Listing'}
          </button>
        </form>
      </div>
    </>
  );
};

export default AddRoomPage;
