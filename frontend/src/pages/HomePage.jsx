import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Hero from '../components/ui/Hero';
import RoomCard from '../components/rooms/RoomCard';
import Loader from '../components/ui/Loader';
import ErrorState from '../components/common/ErrorState';
import api from '../utils/api';
import { FiArrowRight } from 'react-icons/fi';

const HomePage = () => {
  const [featuredRooms, setFeaturedRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFeatured = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.get('/rooms', { params: { limit: 6, sort: 'newest' } });
      setFeaturedRooms(data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load rooms');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeatured();
  }, []);

  return (
    <>
      <Helmet>
        <title>RoomNear — Find Student Rooms Near College</title>
        <meta
          name="description"
          content="Find affordable rooms near your college. Browse verified listings, view on map, and contact landlords directly on WhatsApp."
        />
      </Helmet>

      <Hero />

      {/* Featured Rooms */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-surface-900 font-[var(--font-display)]">
              Latest Rooms
            </h2>
            <p className="text-surface-700/60 mt-1">
              Recently listed rooms near campus
            </p>
          </div>
          <Link
            to="/listings"
            className="hidden sm:flex items-center gap-2 text-primary-600 font-medium text-sm hover:text-primary-700 transition-colors"
          >
            View All
            <FiArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <Loader count={6} />
        ) : error ? (
          <ErrorState message={error} onRetry={fetchFeatured} />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
              {featuredRooms.map((room) => (
                <RoomCard key={room._id} room={room} />
              ))}
            </div>

            <div className="text-center mt-10 sm:hidden">
              <Link
                to="/listings"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary-600 text-white rounded-[var(--radius-button)] font-medium hover:bg-primary-700 transition-colors"
              >
                View All Rooms
                <FiArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </>
        )}
      </section>
    </>
  );
};

export default HomePage;
