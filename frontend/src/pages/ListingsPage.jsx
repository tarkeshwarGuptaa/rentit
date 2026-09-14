import { useEffect, useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchRooms, setFilters, setPage,
  selectRooms, selectRoomsPagination, selectRoomsFilters, selectRoomsLoading, selectRoomsError,
} from '../store/slices/roomsSlice';
import RoomGrid from '../components/rooms/RoomGrid';
import RoomFilters from '../components/rooms/RoomFilters';
import RoomSort from '../components/rooms/RoomSort';
import RoomMap from '../components/rooms/RoomMap';
import Loader from '../components/ui/Loader';
import ErrorState from '../components/common/ErrorState';
import { FiMap, FiGrid } from 'react-icons/fi';

const ListingsPage = () => {
  const dispatch = useDispatch();
  const rooms = useSelector(selectRooms);
  const pagination = useSelector(selectRoomsPagination);
  const filters = useSelector(selectRoomsFilters);
  const loading = useSelector(selectRoomsLoading);
  const error = useSelector(selectRoomsError);

  const [highlightedRoom, setHighlightedRoom] = useState(null);
  const [showMap, setShowMap] = useState(true);

  // Fetch whenever filters change
  useEffect(() => {
    dispatch(fetchRooms(filters));
  }, [dispatch, filters]);

  const handleFilterChange = useCallback((updates) => {
    dispatch(setFilters(updates));
  }, [dispatch]);

  const handleSortChange = useCallback((sort) => {
    dispatch(setFilters({ sort }));
  }, [dispatch]);

  const handlePageChange = useCallback((page) => {
    dispatch(setPage(page));
  }, [dispatch]);

  const handleMarkerClick = useCallback((room) => {
    setHighlightedRoom(room);
  }, []);

  return (
    <>
      <Helmet>
        <title>Browse Rooms — rentIt</title>
        <meta name="description" content="Browse and filter student rooms near college. View on map and find your perfect accommodation." />
      </Helmet>

      <div className="px-4 sm:px-6 lg:px-10 py-6">
        {/* Filters */}
        <div className="mb-5">
          <RoomFilters filters={filters} onFilterChange={handleFilterChange} />
        </div>

        {/* Sort + Map Toggle */}
        <div className="flex items-center justify-between mb-5">
          <RoomSort currentSort={filters.sort || 'newest'} onSortChange={handleSortChange} totalRooms={pagination.total} />
          <button onClick={() => setShowMap(!showMap)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-zinc-200 rounded-lg text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors cursor-pointer lg:hidden">
            {showMap ? <FiGrid className="w-4 h-4" /> : <FiMap className="w-4 h-4" />}
            {showMap ? 'Grid View' : 'Map View'}
          </button>
        </div>

        {/* Main split */}
        {loading ? (
          <Loader count={6} />
        ) : error ? (
          <ErrorState message={error} onRetry={() => dispatch(fetchRooms(filters))} />
        ) : (
          <div className="flex gap-6">
            {/* Cards */}
            <div
              className={`${showMap ? 'hidden lg:block lg:w-[55%]' : 'w-full'} overflow-y-auto`}
              style={{ maxHeight: 'calc(100vh - 64px - 160px)' }}
            >
              <RoomGrid rooms={rooms} highlightedId={highlightedRoom?._id} />

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                        page === pagination.page
                          ? 'bg-indigo-600 text-white'
                          : 'bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Map */}
            <div
              className={`${showMap ? 'w-full lg:w-[45%]' : 'hidden'} sticky top-16`}
              style={{ height: 'calc(100vh - 64px - 160px)' }}
            >
              <RoomMap rooms={rooms} highlightedRoom={highlightedRoom} onMarkerClick={handleMarkerClick} className="h-full" />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ListingsPage;
