import { Link } from 'react-router-dom';
import { FiSearch, FiMapPin, FiShield, FiMessageCircle, FiArrowRight } from 'react-icons/fi';

const Hero = () => {
  return (
    <section className="relative overflow-hidden" style={{ backgroundColor: '#09090b' }}>
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=1600&q=80"
          alt="Student housing"
          className="w-full h-full object-cover"
          style={{ opacity: 0.25 }}
        />
        {/* Dark overlay — inline style to avoid broken opacity-modifier Tailwind classes */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, #09090b 0%, rgba(30,27,75,0.9) 50%, rgba(9,9,11,0.97) 100%)',
          }}
        />
        {/* Subtle glow blob top-right */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: '-5%',
            right: '-3%',
            width: '420px',
            height: '420px',
            background: 'radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)',
          }}
        />
        {/* Subtle glow blob bottom-left */}
        <div
          className="absolute pointer-events-none"
          style={{
            bottom: '-5%',
            left: '-3%',
            width: '360px',
            height: '360px',
            background: 'radial-gradient(circle, rgba(245,158,11,0.10) 0%, transparent 70%)',
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative px-4 sm:px-6 lg:px-10 py-14 sm:py-20 lg:py-24">
        <div style={{ maxWidth: '680px' }}>

          {/* Tag pill */}
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-8 animate-fade-in-up"
            style={{
              background: 'rgba(99,102,241,0.12)',
              border: '1px solid rgba(129,140,248,0.25)',
              color: '#a5b4fc',
            }}
          >
            <FiMapPin className="w-3.5 h-3.5" />
            Near IIT Delhi · Verified Listings
          </div>

          {/* Headline */}
          <h1
            className="font-extrabold text-white leading-tight tracking-tight mb-6 font-display animate-fade-in-up"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', lineHeight: '1.08' }}
          >
            Find the
            <span
              className="block"
              style={{
                backgroundImage: 'linear-gradient(90deg, #818cf8, #a5b4fc, #fbbf24)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                color: 'transparent',
              }}
            >
              perfect room
            </span>
            near campus
          </h1>

          {/* Subtext */}
          <p
            className="text-lg leading-relaxed mb-10 animate-fade-in-up"
            style={{ color: 'rgba(255,255,255,0.55)', maxWidth: '520px' }}
          >
            Browse verified rooms, connect directly with landlords on WhatsApp,
            and move in without any brokerage.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-3 animate-fade-in-up">
            <Link
              to="/listings"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-indigo-600 text-white rounded-xl text-base font-semibold hover:bg-indigo-500 transition-all"
              style={{ boxShadow: '0 4px 20px 0 rgba(79,70,229,0.4)' }}
            >
              <FiSearch className="w-4 h-4" />
              Browse Rooms
              <FiArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-white rounded-xl text-base font-semibold transition-all"
              style={{
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.15)',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}
            >
              List Your Room
            </Link>
          </div>

          {/* Stats row */}
          <div
            className="flex flex-wrap items-center gap-6 mt-12 pt-8 animate-fade-in-up"
            style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
          >
            {[
              { num: '500+', label: 'Verified Rooms' },
              { num: '2,000+', label: 'Happy Students' },
              { num: '₹0', label: 'Brokerage' },
            ].map(({ num, label }, i) => (
              <div key={label} className="flex items-center gap-4">
                {i > 0 && <div style={{ width: '1px', height: '2rem', background: 'rgba(255,255,255,0.08)' }} />}
                <div>
                  <p className="text-2xl font-bold text-white font-display">{num}</p>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.38)' }}>{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How it works strip */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
        <div className="px-4 sm:px-6 lg:px-10 py-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: FiSearch, label: 'Search & Filter', desc: 'By area, price, type and amenities' },
              { icon: FiShield, label: 'Verified Listings', desc: 'Real photos and genuine landlords' },
              { icon: FiMessageCircle, label: 'Chat on WhatsApp', desc: 'Direct contact, zero middlemen' },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex items-center gap-4">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(129,140,248,0.2)' }}
                >
                  <Icon className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">{label}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.38)' }}>{desc}</p>
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
