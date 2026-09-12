import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FiHome,
  FiSearch,
  FiLogIn,
  FiLogOut,
  FiUser,
  FiGrid,
  FiPlusCircle,
  FiMenu,
  FiX,
} from 'react-icons/fi';

const Navbar = () => {
  const { user, isAuthenticated, isLandlord, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const navLinkClass = (path) =>
    `flex items-center gap-2 px-3 py-2 rounded-[var(--radius-button)] text-sm font-medium transition-all duration-200 ${
      isActive(path)
        ? 'bg-primary-50 text-primary-700'
        : 'text-surface-700 hover:bg-surface-100 hover:text-surface-900'
    }`;

  return (
    <nav className="sticky top-0 z-50 glass border-b border-surface-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 group"
          >
            <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700 rounded-[var(--radius-input)] flex items-center justify-center group-hover:scale-105 transition-transform">
              <FiHome className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent font-[var(--font-display)]">
              RoomNear
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            <Link to="/listings" className={navLinkClass('/listings')}>
              <FiSearch className="w-4 h-4" />
              Browse Rooms
            </Link>

            {isAuthenticated && isLandlord && (
              <>
                <Link to="/dashboard" className={navLinkClass('/dashboard')}>
                  <FiGrid className="w-4 h-4" />
                  Dashboard
                </Link>
                <Link to="/add-room" className={navLinkClass('/add-room')}>
                  <FiPlusCircle className="w-4 h-4" />
                  List Room
                </Link>
              </>
            )}

            {isAuthenticated ? (
              <div className="flex items-center gap-1 ml-2 pl-2 border-l border-surface-200">
                <Link to="/profile" className={navLinkClass('/profile')}>
                  <FiUser className="w-4 h-4" />
                  {user?.name?.split(' ')[0]}
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2 rounded-[var(--radius-button)] text-sm font-medium text-surface-700 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
                >
                  <FiLogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 ml-2 pl-2 border-l border-surface-200">
                <Link to="/login" className={navLinkClass('/login')}>
                  <FiLogIn className="w-4 h-4" />
                  Login
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-[var(--radius-button)] text-sm font-medium hover:bg-primary-700 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-[var(--radius-button)] hover:bg-surface-100 transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? (
              <FiX className="w-6 h-6 text-surface-700" />
            ) : (
              <FiMenu className="w-6 h-6 text-surface-700" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-surface-200 animate-fade-in">
            <div className="flex flex-col gap-1">
              <Link
                to="/listings"
                className={navLinkClass('/listings')}
                onClick={() => setMobileMenuOpen(false)}
              >
                <FiSearch className="w-4 h-4" />
                Browse Rooms
              </Link>

              {isAuthenticated && isLandlord && (
                <>
                  <Link
                    to="/dashboard"
                    className={navLinkClass('/dashboard')}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <FiGrid className="w-4 h-4" />
                    Dashboard
                  </Link>
                  <Link
                    to="/add-room"
                    className={navLinkClass('/add-room')}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <FiPlusCircle className="w-4 h-4" />
                    List Room
                  </Link>
                </>
              )}

              {isAuthenticated ? (
                <>
                  <Link
                    to="/profile"
                    className={navLinkClass('/profile')}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <FiUser className="w-4 h-4" />
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-3 py-2 rounded-[var(--radius-button)] text-sm font-medium text-red-600 hover:bg-red-50 transition-colors cursor-pointer text-left"
                  >
                    <FiLogOut className="w-4 h-4" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className={navLinkClass('/login')}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <FiLogIn className="w-4 h-4" />
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-[var(--radius-button)] text-sm font-medium hover:bg-primary-700 transition-colors mt-1"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Create Account
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
