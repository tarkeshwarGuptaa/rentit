import { Link } from 'react-router-dom';
import { FiHeart, FiMail } from 'react-icons/fi';
import { FaInstagram } from "react-icons/fa6";
import { FaWhatsapp } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const Footer = () => {

  return (
    <footer className="bg-zinc-950 text-zinc-400" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="px-4 sm:px-6 lg:px-10 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="inline-flex items-center gap-2.5 mb-5 group">
              <span className="text-2xl font-bold text-white font-display">
                rentIt
              </span>
            </Link>
            <p className="text-zinc-400/70 text-sm leading-relaxed max-w-xs">
              Connecting students with verified landlords near campus. No brokerage, no hassle — just move in.
            </p>

            {/* Socials */}
            <div className="flex items-center gap-3 mt-6">
              {[
                { icon: FaInstagram, href: 'https://github.com', label: 'Instagram' },
                { icon: FaXTwitter, href: '#', label: 'Twitter' },
                { icon: FaWhatsapp, href: '#', label: 'Whatsapp' },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className=" flex items-center justify-center text-zinc-400 hover:text-white transition-all"
                  
                >
                  <Icon size={20} className="stroke-[2.5]" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-xs font-semibold uppercase tracking-widest mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Browse Rooms', to: '/listings' },
                { label: 'List a Room', to: '/register' },
                { label: 'Login', to: '/login' },
              ].map(({ label, to }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="text-sm hover:text-white transition-colors"
                    style={{ color: 'rgba(161,161,170,0.7)' }}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white text-xs font-semibold uppercase tracking-widest mb-4">
              Support
            </h4>
            <ul className="space-y-2.5">
              <li>
                <a
                  href="mailto:support@rentit.in"
                  className="text-sm hover:text-white transition-colors flex items-center gap-2"
                  style={{ color: 'rgba(161,161,170,0.7)' }}
                >
                  <FiMail className="w-3.5 h-3.5" />
                  support@rentit.in
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-5 flex flex-col sm:flex-row items-center justify-between gap-3" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <p className="text-xs text-slate-200" style={{ opacity: 0.4 }}>
            © {new Date().getFullYear()} rentIt. Made with{' '}
            <FiHeart className="inline w-3 h-3 text-amber-500" /> for students.
          </p>
          <p className="text-xs text-slate-200" style={{ opacity: 0.3 }}>No brokerage. Always free for students.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
