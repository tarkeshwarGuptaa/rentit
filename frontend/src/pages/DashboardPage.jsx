import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import api from '../utils/api';
import Loader from '../components/ui/Loader';
import ErrorState from '../components/common/ErrorState';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import {
  FiPlusCircle,
  FiEdit2,
  FiTrash2,
  FiToggleLeft,
  FiToggleRight,
  FiMapPin,
  FiEye,
  FiInbox,
} from 'react-icons/fi';

const DashboardPage = () => {
  const { user } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMyListings = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.get('/rooms/my-listings');
      setRooms(data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load your listings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyListings();
  }, []);

  const handleToggle = async (roomId) => {
    try {
      const { data } = await api.patch(`/rooms/${roomId}/availability`);
      setRooms((prev) =>
        prev.map((r) => (r._id === roomId ? { ...r, isAvailable: data.data.isAvailable } : r))
      );
      toast.success(data.data.isAvailable ? 'Room marked as available' : 'Room marked as occupied');
    } catch {
      toast.error('Failed to toggle availability');
    }
  };

  const handleDelete = async (roomId) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;

    try {
      await api.delete(`/rooms/${roomId}`);
      setRooms((prev) => prev.filter((r) => r._id !== roomId));
      toast.success('Listing deleted');
    } catch {
      toast.error('Failed to delete listing');
    }
  };

  const formatRent = (amount) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

  return (
    <>
      <Helmet>
        <title>Dashboard — RoomNear</title>
      </Helmet>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-surface-900 font-[var(--font-display)]">
              Your Listings
            </h1>
            <p className="text-surface-700/60 mt-1">
              Welcome back, {user?.name}! Manage your room listings here.
            </p>
          </div>
          <Link
            to="/add-room"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-[var(--radius-button)] font-semibold text-sm hover:bg-primary-700 transition-all hover:shadow-lg hover:shadow-primary-600/25"
          >
            <FiPlusCircle className="w-4 h-4" />
            Add New Room
          </Link>
        </div>

        {/* Content */}
        {loading ? (
          <Loader count={4} />
        ) : error ? (
          <ErrorState message={error} onRetry={fetchMyListings} />
        ) : rooms.length === 0 ? (
          <div className="text-center py-20 animate-fade-in">
            <div className="w-20 h-20 bg-surface-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiInbox className="w-10 h-10 text-surface-700/30" />
            </div>
            <h2 className="text-xl font-semibold text-surface-900 mb-2">No listings yet</h2>
            <p className="text-surface-700/60 mb-6 max-w-sm mx-auto">
              Start by listing your first room. Students are looking for rooms near campus!
            </p>
            <Link
              to="/add-room"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-[var(--radius-button)] font-semibold hover:bg-primary-700 transition-colors"
            >
              <FiPlusCircle className="w-5 h-5" />
              List Your First Room
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 stagger-children">
            {rooms.map((room) => (
              <div
                key={room._id}
                className="bg-white border border-surface-200 rounded-[var(--radius-card)] overflow-hidden shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-shadow"
              >
                <div className="flex">
                  {/* Thumbnail */}
                  <div className="w-36 sm:w-44 shrink-0">
                    <img
                      src={room.photos?.[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400'}
                      alt={room.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 p-4 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`w-2 h-2 rounded-full ${room.isAvailable ? 'bg-green-500' : 'bg-red-500'}`} />
                        <span className="text-xs text-surface-700/60">
                          {room.isAvailable ? 'Available' : 'Occupied'}
                        </span>
                      </div>

                      <h3 className="font-semibold text-surface-900 text-sm mb-1 line-clamp-1">
                        {room.title}
                      </h3>

                      <div className="flex items-center gap-1 text-surface-700/50 text-xs mb-2">
                        <FiMapPin className="w-3 h-3" />
                        {room.area}
                      </div>

                      <p className="text-primary-600 font-bold text-sm">
                        {formatRent(room.rent)}/month
                      </p>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-3 text-xs text-surface-700/50 mt-2">
                      <span className="flex items-center gap-1">
                        <FiEye className="w-3 h-3" />
                        {room.views} views
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex border-t border-surface-200">
                  <button
                    onClick={() => handleToggle(room._id)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-surface-700 hover:bg-surface-50 transition-colors cursor-pointer"
                  >
                    {room.isAvailable ? (
                      <FiToggleRight className="w-4 h-4 text-green-500" />
                    ) : (
                      <FiToggleLeft className="w-4 h-4 text-surface-700/40" />
                    )}
                    {room.isAvailable ? 'Available' : 'Occupied'}
                  </button>

                  <Link
                    to={`/add-room?edit=${room._id}`}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-primary-600 hover:bg-primary-50 transition-colors border-x border-surface-200"
                  >
                    <FiEdit2 className="w-3.5 h-3.5" />
                    Edit
                  </Link>

                  <button
                    onClick={() => handleDelete(room._id)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    <FiTrash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default DashboardPage;
