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
    `flex items-center gap-1.5  font-semibold transition-colors ${isActive(path)
      ? ' text-indigo-700'
      : 'text-slate-600 hover:text-slate-800'
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-[#f1f1f1] border-b border-slate-200">
      <div className="p-4">
        <div className="flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <div className="group-hover:scale-105 transition-transform"
              >
              <MdOutlineExplore size={36} className="text-indigo-700" />
            </div>
            <span className="text-2xl pb-1 font-bold tracking-tight"
              style={{ background: 'linear-gradient(90deg,#4f46e5,#3730a3)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              rentIt
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">

            <Link to="/listings" className={linkCls('/listings')}>
              <FiSearch size={18} className="stroke-[2.2]" /> Browse
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
                  <FiLogOut size={18} className="stroke-[2.2]" /> Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className={linkCls('/login')}>
                  <FiLogIn size={18} className="stroke-[2.2]" /> Login
                </Link>
                <Link to="/register"
                  className="flex items-center px-3 py-1 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-sm"
                  >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg hover:bg-zinc-100 transition-colors cursor-pointer">
            {mobileOpen ? <FiX  size={24} className="stroke-[2.5] text-slate-700" /> : <FiMenu  size={24} className="stroke-[2.5] text-slate-700" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden mt-2  border-t border-slate-200">
            <div className="flex flex-col gap-1 pt-2">
              <Link to="/listings" className={linkCls('/listings')} onClick={() => setMobileOpen(false)}>
                <FiSearch size={18} className="stroke-[2.5]" /> Browse Rooms
              </Link>
              {isAuthenticated && isLandlord && (
                <>
                  <Link to="/dashboard" className={linkCls('/dashboard')} onClick={() => setMobileOpen(false)}>
                    <FiGrid size={18} className="stroke-[2.5]" /> Dashboard
                  </Link>
                  <Link to="/add-room" className={linkCls('/add-room')} onClick={() => setMobileOpen(false)}>
                    <FiPlusCircle size={18} className="stroke-[2.5]" /> List Room
                  </Link>
                </>
              )}
              <div className=" bg-[#f1f1f1] " />
              {isAuthenticated ? (
                <>
                  <Link to="/profile" className={linkCls('/profile')} onClick={() => setMobileOpen(false)}>
                    <FiUser size={18} className="stroke-[2.5]" /> Profile
                  </Link>
                  <button onClick={handleLogout}
                    className="flex items-center gap-2 px-3 py-1 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors cursor-pointer text-left">
                    <FiLogOut size={18} className="stroke-[2.5]" /> Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className={linkCls('/login')} onClick={() => setMobileOpen(false)}>
                    <FiLogIn size={18} className="stroke-[2.5]" /> Login
                  </Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center mt-1 px-4 py-2 bg-indigo-600 text-white rounded-2xl font-semibold hover:bg-indigo-700 transition-colors">
                    Get Started
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
