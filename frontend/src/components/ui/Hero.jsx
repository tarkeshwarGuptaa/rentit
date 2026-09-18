import { Link } from 'react-router-dom';
import { FiSearch, FiShield, FiMessageCircle, FiArrowRight } from 'react-icons/fi';

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-zinc-950 text-white">
      {/* Background image & gradient overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <img
          src="https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=1600&q=80"
          alt="Student housing"
          className="w-full h-full object-cover opacity-20"
        />
        {/* Dark subtle gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-b from-zinc-950 via-indigo-950/40 to-zinc-950" />

        {/* Ambient glow blobs */}
        {/* Top-right vibrant indigo glow */}
        <div className="absolute -top-20 right-0 w-125 h-125 bg-indigo-600/20 rounded-full blur-[120px]" />

        {/* Center-left soft violet glow to illuminate behind the headline */}
        <div className="absolute top-1/4 -left-20 w-105 h-105 bg-violet-600/15 rounded-full blur-[100px]" />
      </div>

      {/* Main Content */}
      <div className="relative p-6 md:p-8">
        <div className="max-w-2xl">

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            Find the{' '}
            <span className="block bg-gradient-to-r from-indigo-400 via-indigo-200 to-amber-300 bg-clip-text text-transparent">
              perfect room
            </span>
          </h1>

          {/* Subtext */}
          <p className="text-base sm:text-lg text-slate-300 mb-6 max-w-lg">
            Browse verified rooms, connect directly with landlords on WhatsApp,
            and move in without any brokerage.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-3.5">
            <Link
              to="/listings"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm sm:text-base font-semibold shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/40 hover:-translate-y-0.5 active:translate-y-0 transition-all"
            >
              <FiSearch size={24} className="stroke-[2.5]" />
              Browse Rooms
              <FiArrowRight size={24} className="stroke-[2.5]" />
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white/5 hover:bg-white/10 text-white border border-white/15 hover:border-white/30 rounded-xl text-sm sm:text-base font-semibold backdrop-blur-sm hover:-translate-y-0.5 active:translate-y-0 transition-all"
            >
              List Your Room
            </Link>
          </div>
        </div>
      </div>

      {/* How it works strip */}
      <div className="border-t border-white/10 bg-white/[0.02] backdrop-blur-xs">
        <div className="p-4 md:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: FiSearch, label: 'Search & Filter', desc: 'By area, price, type and amenities' },
              { icon: FiShield, label: 'Verified Listings', desc: 'Real photos and genuine landlords' },
              { icon: FiMessageCircle, label: 'Chat on WhatsApp', desc: 'Direct contact, zero middlemen' },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex items-center gap-4 group">
                <div className="p-2 rounded-full flex items-center justify-center shrink-0 bg-indigo-500/10 border border-indigo-400/20 group-hover:border-indigo-400/40 group-hover:bg-indigo-500/15 transition-all">
                  <Icon size={24} className="stroke-[2.5] text-indigo-400" />
                </div>
                <div>
                  <p className="text-white  font-semibold">{label}</p>
                  <p className="text-sm text-zinc-400 ">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
