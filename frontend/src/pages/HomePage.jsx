import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRooms, selectRooms, selectRoomsLoading, selectRoomsError } from '../store/slices/roomsSlice';
import Hero from '../components/ui/Hero';
import RoomCard from '../components/rooms/RoomCard';
import Loader from '../components/ui/Loader';
import ErrorState from '../components/common/ErrorState';
import { FiArrowRight } from 'react-icons/fi';

const HomePage = () => {
  const dispatch = useDispatch();
  const rooms = useSelector(selectRooms);
  const loading = useSelector(selectRoomsLoading);
  const error = useSelector(selectRoomsError);

  useEffect(() => {
    dispatch(fetchRooms({ limit: 6, sort: 'newest' }));
  }, [dispatch]);

  return (
    <>
      <Helmet>
        <title>rentIt</title>
        <meta name="description" content="Find affordable rooms near your college. Browse verified listings, view on map, and contact landlords directly on WhatsApp." />
      </Helmet>

      <Hero />

      {/* Featured Listings */}
      <section className="p-6 md:p-8">
        <div className="flex items-end justify-between mb-6">
          
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900">
              Latest Listings
            </h2>
          
          <Link to="/listings"
            className="hidden sm:flex items-center gap-1.5 text-indigo-600 font-bold text-sm hover:text-indigo-700 transition-colors">
            View All <FiArrowRight size={18} className="stroke-[2.5]" />
          </Link>
        </div>

        {loading ? (
          <Loader count={6} />
        ) : error ? (
          <ErrorState message={error} onRetry={() => dispatch(fetchRooms({ limit: 6, sort: 'newest' }))} />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
              {rooms.map((room, i) => (
                <div key={room._id} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.06}s` }}>
                  <RoomCard room={room} />
                </div>
              ))}
            </div>
            <div className="text-center mt-10 sm:hidden">
              <Link to="/listings"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                View All Rooms <FiArrowRight size={24} className="stroke-[2.5]" />
              </Link>
            </div>
          </>
        )}
      </section>
    </>
  );
};

export default HomePage;
