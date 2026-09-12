import { useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import RoomGrid from '../components/rooms/RoomGrid';
import RoomFilters from '../components/rooms/RoomFilters';
import RoomSort from '../components/rooms/RoomSort';
import RoomMap from '../components/rooms/RoomMap';
import Loader from '../components/ui/Loader';
import ErrorState from '../components/common/ErrorState';
import useRooms from '../hooks/useRooms';
import { FiMap, FiGrid } from 'react-icons/fi';

const ListingsPage = () => {
  const { rooms, loading, error, pagination, filters, updateFilters, refetch } =
    useRooms({ sort: 'newest' });

  const [highlightedRoom, setHighlightedRoom] = useState(null);
  const [showMap, setShowMap] = useState(true);

  const handleMarkerClick = useCallback((room) => {
    setHighlightedRoom(room);
  }, []);

  const handleSortChange = useCallback(
    (sort) => {
      updateFilters({ sort });
    },
    [updateFilters]
  );

  return (
    <>
      <Helmet>
        <title>Browse Rooms — RoomNear</title>
        <meta name="description" content="Browse and filter student rooms near college. View on map and find your perfect accommodation." />
      </Helmet>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6">
        {/* Filters */}
        <div className="mb-5">
          <RoomFilters filters={filters} onFilterChange={updateFilters} />
        </div>

        {/* Sort + Map Toggle */}
        <div className="flex items-center justify-between mb-5">
          <RoomSort
            currentSort={filters.sort || 'newest'}
            onSortChange={handleSortChange}
            totalRooms={pagination.total}
          />

          <button
            onClick={() => setShowMap(!showMap)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-surface-200 rounded-[var(--radius-input)] text-sm font-medium text-surface-700 hover:bg-surface-50 transition-colors cursor-pointer lg:hidden"
          >
            {showMap ? <FiGrid className="w-4 h-4" /> : <FiMap className="w-4 h-4" />}
            {showMap ? 'Grid View' : 'Map View'}
          </button>
        </div>

        {/* Main Content: Split View */}
        {loading ? (
          <Loader count={6} />
        ) : error ? (
          <ErrorState message={error} onRetry={refetch} />
        ) : (
          <div className="flex gap-6">
            {/* Left: Cards */}
            <div
              className={`${
                showMap ? 'hidden lg:block lg:w-[55%]' : 'w-full'
              } overflow-y-auto`}
              style={{ maxHeight: 'calc(100vh - 220px)' }}
            >
              <RoomGrid rooms={rooms} highlightedId={highlightedRoom?._id} />

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => updateFilters({ page })}
                        className={`w-10 h-10 rounded-[var(--radius-input)] text-sm font-medium transition-colors cursor-pointer ${
                          page === pagination.page
                            ? 'bg-primary-600 text-white'
                            : 'bg-white border border-surface-200 text-surface-700 hover:bg-surface-50'
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}
                </div>
              )}
            </div>

            {/* Right: Map */}
            <div
              className={`${
                showMap ? 'w-full lg:w-[45%]' : 'hidden'
              } sticky top-20`}
              style={{ height: 'calc(100vh - 220px)' }}
            >
              <RoomMap
                rooms={rooms}
                highlightedRoom={highlightedRoom}
                onMarkerClick={handleMarkerClick}
                className="h-full"
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ListingsPage;
