import { Link } from 'react-router-dom';
import { FiSearch, FiMapPin, FiShield, FiMessageCircle } from 'react-icons/fi';

const Hero = () => {
  return (
    <section className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=1600&q=80"
          alt="Student housing"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-surface-950/85 via-surface-950/70 to-surface-950/50" />
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-24 sm:py-32 lg:py-40">
        <div className="max-w-2xl animate-fade-in-up">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-500/20 border border-primary-400/30 rounded-[var(--radius-badge)] text-primary-200 text-sm font-medium mb-6">
            <FiMapPin className="w-4 h-4" />
            Near IIT Delhi
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6 font-[var(--font-display)]">
            Find Your Perfect
            <span className="bg-gradient-to-r from-primary-400 to-blue-400 bg-clip-text text-transparent">
              {' '}Room{' '}
            </span>
            Near College
          </h1>

          <p className="text-lg sm:text-xl text-white/70 mb-10 leading-relaxed">
            Browse verified rooms, connect with landlords instantly on WhatsApp, 
            and move in without the hassle. Your next home is just a click away.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/listings"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-primary-600 text-white rounded-[var(--radius-button)] text-base font-semibold hover:bg-primary-700 transition-all hover:shadow-lg hover:shadow-primary-600/25 hover:-translate-y-0.5"
            >
              <FiSearch className="w-5 h-5" />
              Browse Rooms
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white/10 text-white border border-white/20 rounded-[var(--radius-button)] text-base font-semibold hover:bg-white/20 transition-all backdrop-blur-sm"
            >
              List Your Room
            </Link>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="relative bg-white/5 backdrop-blur-lg border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary-500/20 rounded-[var(--radius-input)] flex items-center justify-center shrink-0">
                <FiSearch className="w-6 h-6 text-primary-300" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Search & Filter</h3>
                <p className="text-white/50 text-sm">Browse rooms by area, price, type, and amenities with map view</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary-500/20 rounded-[var(--radius-input)] flex items-center justify-center shrink-0">
                <FiShield className="w-6 h-6 text-primary-300" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Verified Listings</h3>
                <p className="text-white/50 text-sm">Real photos, accurate pricing, and genuine landlord profiles</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary-500/20 rounded-[var(--radius-input)] flex items-center justify-center shrink-0">
                <FiMessageCircle className="w-6 h-6 text-primary-300" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Connect on WhatsApp</h3>
                <p className="text-white/50 text-sm">Message landlords directly. No middlemen, no brokerage</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
