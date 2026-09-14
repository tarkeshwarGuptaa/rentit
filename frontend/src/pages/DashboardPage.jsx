import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyRooms, deleteMyRoom, toggleMyRoomAvailability, selectMyRooms, selectMyRoomsLoading, selectMyRoomsError } from '../store/slices/myRoomsSlice';
import { selectUser } from '../store/slices/authSlice';
import Loader from '../components/ui/Loader';
import ErrorState from '../components/common/ErrorState';
import toast from 'react-hot-toast';
import { FiPlusCircle, FiEdit2, FiTrash2, FiToggleLeft, FiToggleRight, FiMapPin, FiEye, FiInbox } from 'react-icons/fi';

const formatRent = (amount) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

const DashboardPage = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const rooms = useSelector(selectMyRooms);
  const loading = useSelector(selectMyRoomsLoading);
  const error = useSelector(selectMyRoomsError);

  useEffect(() => {
    dispatch(fetchMyRooms());
  }, [dispatch]);

  const handleToggle = async (roomId) => {
    const result = await dispatch(toggleMyRoomAvailability(roomId));
    if (toggleMyRoomAvailability.fulfilled.match(result)) {
      toast.success(result.payload.isAvailable ? 'Marked as available' : 'Marked as occupied');
    } else {
      toast.error('Failed to update availability');
    }
  };

  const handleDelete = async (roomId) => {
    if (!window.confirm('Delete this listing? This cannot be undone.')) return;
    const result = await dispatch(deleteMyRoom(roomId));
    if (deleteMyRoom.fulfilled.match(result)) {
      toast.success('Listing deleted');
    } else {
      toast.error('Failed to delete listing');
    }
  };

  return (
    <>
      <Helmet>
        <title>Dashboard — rentIt</title>
      </Helmet>

      <div className="px-4 sm:px-6 lg:px-10 py-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 font-display">
              Your Listings
            </h1>
            <p className="text-zinc-400 mt-1 text-sm">
              Welcome back, {user?.name}! Manage your room listings here.
            </p>
          </div>
          <Link to="/add-room"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-all"
            style={{ boxShadow: '0 4px 12px rgba(79,70,229,0.25)' }}>
            <FiPlusCircle className="w-4 h-4" /> Add New Room
          </Link>
        </div>

        {loading ? (
          <Loader count={4} />
        ) : error ? (
          <ErrorState message={error} onRetry={() => dispatch(fetchMyRooms())} />
        ) : rooms.length === 0 ? (
          <div className="text-center py-20 animate-fade-in">
            <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiInbox className="w-10 h-10 text-zinc-300" />
            </div>
            <h2 className="text-xl font-semibold text-zinc-900 mb-2">No listings yet</h2>
            <p className="text-zinc-400 mb-6 max-w-sm mx-auto text-sm">
              Start by listing your first room. Students are looking for rooms near campus!
            </p>
            <Link to="/add-room"
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors">
              <FiPlusCircle className="w-5 h-5" /> List Your First Room
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {rooms.map((room) => (
              <div key={room._id}
                className="bg-white border border-zinc-200 rounded-2xl overflow-hidden transition-shadow hover:shadow-lg"
                style={{ boxShadow: 'var(--shadow-card)' }}>
                <div className="flex">
                  <div className="w-36 sm:w-44 shrink-0">
                    <img
                      src={room.photos?.[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400'}
                      alt={room.title} className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 p-4 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`w-2 h-2 rounded-full ${room.isAvailable ? 'bg-green-500' : 'bg-red-400'}`} />
                        <span className="text-xs text-zinc-400">{room.isAvailable ? 'Available' : 'Occupied'}</span>
                      </div>
                      <h3 className="font-semibold text-zinc-900 text-sm mb-1 line-clamp-1">{room.title}</h3>
                      <div className="flex items-center gap-1 text-zinc-400 text-xs mb-2">
                        <FiMapPin className="w-3 h-3" /> {room.area}
                      </div>
                      <p className="text-indigo-600 font-bold text-sm">{formatRent(room.rent)}/month</p>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-zinc-400 mt-2">
                      <span className="flex items-center gap-1"><FiEye className="w-3 h-3" />{room.views} views</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex border-t border-zinc-200">
                  <button onClick={() => handleToggle(room._id)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50 transition-colors cursor-pointer">
                    {room.isAvailable
                      ? <FiToggleRight className="w-4 h-4 text-green-500" />
                      : <FiToggleLeft className="w-4 h-4 text-zinc-300" />
                    }
                    {room.isAvailable ? 'Available' : 'Occupied'}
                  </button>
                  <Link to={`/add-room?edit=${room._id}`}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-indigo-600 hover:bg-indigo-50 transition-colors border-x border-zinc-200">
                    <FiEdit2 className="w-3.5 h-3.5" /> Edit
                  </Link>
                  <button onClick={() => handleDelete(room._id)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-red-500 hover:bg-red-50 transition-colors cursor-pointer">
                    <FiTrash2 className="w-3.5 h-3.5" /> Delete
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
