import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, selectUser, selectIsAuthenticated, selectIsLandlord } from '../../store/slices/authSlice';
import {
  FiSearch, FiLogIn, FiLogOut, FiUser,
  FiGrid, FiPlusCircle, FiMenu, FiX,
} from 'react-icons/fi';
import { MdOutlineExplore } from 'react-icons/md';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLandlord = useSelector(selectIsLandlord);

  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    setMobileOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const linkCls = (path) =>
    `flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-colors ${isActive(path)
      ? 'bg-indigo-50 text-indigo-700 font-semibold'
      : 'text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900'
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-zinc-200"
      style={{ boxShadow: '0 1px 3px 0 rgba(0,0,0,0.06)' }}>
      <div className="px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform"
              style={{ background: 'linear-gradient(135deg, #6366f1, #4338ca)' }}>
              <MdOutlineExplore size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold font-display tracking-tight"
              style={{ background: 'linear-gradient(90deg,#4f46e5,#3730a3)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              rentIt
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-0.5">
            <Link to="/listings" className={linkCls('/listings')}>
              <FiSearch className="w-3.5 h-3.5" /> Browse
            </Link>
            {isAuthenticated && isLandlord && (
              <>
                <Link to="/dashboard" className={linkCls('/dashboard')}>
                  <FiGrid className="w-3.5 h-3.5" /> Dashboard
                </Link>
                <Link to="/add-room" className={linkCls('/add-room')}>
                  <FiPlusCircle className="w-3.5 h-3.5" /> List Room
                </Link>
              </>
            )}

            <div className="w-px h-5 bg-zinc-200 mx-2" />

            {isAuthenticated ? (
              <div className="flex items-center gap-1">
                <Link to="/profile" className={linkCls('/profile')}>
                  <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center">
                    <FiUser className="w-3 h-3 text-indigo-600" />
                  </div>
                  {user?.name?.split(' ')[0]}
                </Link>
                <button onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium text-zinc-400 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer">
                  <FiLogOut className="w-3.5 h-3.5" /> Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className={linkCls('/login')}>
                  <FiLogIn className="w-3.5 h-3.5" /> Login
                </Link>
                <Link to="/register"
                  className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors"
                  style={{ boxShadow: '0 2px 8px rgba(79,70,229,0.3)' }}>
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg hover:bg-zinc-100 transition-colors cursor-pointer">
            {mobileOpen ? <FiX className="w-5 h-5 text-zinc-700" /> : <FiMenu className="w-5 h-5 text-zinc-700" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 border-t border-zinc-100 animate-fade-in">
            <div className="flex flex-col gap-0.5 pt-3">
              <Link to="/listings" className={linkCls('/listings')} onClick={() => setMobileOpen(false)}>
                <FiSearch className="w-4 h-4" /> Browse Rooms
              </Link>
              {isAuthenticated && isLandlord && (
                <>
                  <Link to="/dashboard" className={linkCls('/dashboard')} onClick={() => setMobileOpen(false)}>
                    <FiGrid className="w-4 h-4" /> Dashboard
                  </Link>
                  <Link to="/add-room" className={linkCls('/add-room')} onClick={() => setMobileOpen(false)}>
                    <FiPlusCircle className="w-4 h-4" /> List Room
                  </Link>
                </>
              )}
              <div className="h-px bg-zinc-100 my-2" />
              {isAuthenticated ? (
                <>
                  <Link to="/profile" className={linkCls('/profile')} onClick={() => setMobileOpen(false)}>
                    <FiUser className="w-4 h-4" /> Profile
                  </Link>
                  <button onClick={handleLogout}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors cursor-pointer text-left">
                    <FiLogOut className="w-4 h-4" /> Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className={linkCls('/login')} onClick={() => setMobileOpen(false)}>
                    <FiLogIn className="w-4 h-4" /> Login
                  </Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center mt-1 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors">
                    Get Started — Free
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
