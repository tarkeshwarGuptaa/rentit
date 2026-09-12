import { Link } from 'react-router-dom';
import { FiHome, FiHeart, FiMail, FiGithub } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-surface-900 text-surface-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-primary-400 to-primary-600 rounded-[var(--radius-input)] flex items-center justify-center">
                <FiHome className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white font-[var(--font-display)]">
                RoomNear
              </span>
            </Link>
            <p className="text-surface-200/60 text-sm leading-relaxed max-w-sm">
              Find your perfect room near college. RoomNear connects students with verified landlords 
              for hassle-free room hunting. Browse, compare, and connect instantly.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/listings" className="text-sm hover:text-primary-400 transition-colors">
                  Browse Rooms
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-sm hover:text-primary-400 transition-colors">
                  List Your Room
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-sm hover:text-primary-400 transition-colors">
                  Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Support
            </h4>
            <ul className="space-y-2.5">
              <li>
                <a
                  href="mailto:support@roomnear.in"
                  className="text-sm hover:text-primary-400 transition-colors flex items-center gap-2"
                >
                  <FiMail className="w-4 h-4" />
                  support@roomnear.in
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-surface-700/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-surface-200/50">
            © {new Date().getFullYear()} RoomNear. Made with{' '}
            <FiHeart className="inline w-3 h-3 text-accent-500" /> for students.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-surface-200/50 hover:text-white transition-colors"
            >
              <FiGithub className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
